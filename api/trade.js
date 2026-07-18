import { getSupabase, setupMissingPayload, getOrCreateAccount, ensureUser } from './_supabase.js';
import { parseBody, cleanSymbol, normalizeMarket, normalizeCurrency, fetchUsdRates, localToUsd, localToUsdRate, json } from './_market.js';
import { fetchMarketMA } from './_quote.js';

function assertPositive(n,name){
  const x=Number(n);
  if(!Number.isFinite(x)||x<=0) throw new Error(name+' must be positive');
  return x;
}

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,X-Luoshu-User');
  if(req.method==='OPTIONS'){res.status(204).end();return;}
  if(req.method!=='POST'){json(res,405,{ok:false,error:'POST only'});return;}
  try{
    const sb=getSupabase();
    const body=parseBody(req);
    const user_id=String(body.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    await ensureUser(sb,user_id);
    const action=String(body.action||'buy').toLowerCase();
    const account=await getOrCreateAccount(sb,user_id,Number(body.initial_cash_usd||100000));
    const rates=await fetchUsdRates();

    if(action==='buy'){
      const symbol=cleanSymbol(body.symbol);
      if(!symbol) throw new Error('missing symbol');
      const market=normalizeMarket(symbol,body.market);
      const currency=normalizeCurrency(body.currency,market);
      let price=Number(body.price_local);
      if(!Number.isFinite(price)||price<=0){
        const q=await fetchMarketMA(symbol);
        if(!q.ok || !Number.isFinite(Number(q.price))) throw new Error('无法获取当前价格，请手动输入成交价');
        price=Number(q.price);
      }
      price=assertPositive(price,'price_local');
      const quantity=assertPositive(body.quantity,'quantity');
      const notionalLocal=price*quantity;
      const notionalUsd=localToUsd(notionalLocal,currency,rates);
      const cashBefore=Number(account.cash_usd||0);
      if(notionalUsd>cashBefore+1e-8){
        json(res,200,{ok:false,code:'insufficient_cash',error:'可用现金不足',max_cash_usd:cashBefore,required_usd:notionalUsd});
        return;
      }
      const cashAfter=cashBefore-notionalUsd;

      const {data:pos,error:pErr}=await sb.from('virtual_positions')
        .select('*').eq('user_id',user_id).eq('account_id',account.id).eq('symbol',symbol).eq('status','open')
        .limit(1).maybeSingle();
      if(pErr) throw pErr;

      let position;
      if(pos){
        const oldQty=Number(pos.quantity||0);
        const newQty=oldQty+quantity;
        const newCostUsd=Number(pos.cost_usd||0)+notionalUsd;
        const newAvgLocal=((Number(pos.avg_price_local||0)*oldQty)+(price*quantity))/newQty;
        const {data,error}=await sb.from('virtual_positions').update({
          quantity:newQty,
          avg_price_local:newAvgLocal,
          cost_local:Number(pos.cost_local||0)+notionalLocal,
          cost_usd:newCostUsd,
          current_price_local:price,
          current_value_usd:localToUsd(price*newQty,currency,rates),
          pnl_usd:localToUsd(price*newQty,currency,rates)-newCostUsd,
          pnl_pct:newCostUsd>0?(localToUsd(price*newQty,currency,rates)-newCostUsd)/newCostUsd*100:0,
          updated_at:new Date().toISOString()
        }).eq('id',pos.id).select('*').single();
        if(error) throw error;
        position=data;
      }else{
        const {data,error}=await sb.from('virtual_positions').insert({
          user_id,account_id:account.id,symbol,market,currency,
          quantity,
          avg_price_local:price,
          cost_local:notionalLocal,
          cost_usd:notionalUsd,
          current_price_local:price,
          current_value_usd:notionalUsd,
          pnl_usd:0,
          pnl_pct:0,
          status:'open',
          opened_at:new Date().toISOString()
        }).select('*').single();
        if(error) throw error;
        position=data;
      }

      const {error:aErr}=await sb.from('portfolio_accounts').update({cash_usd:cashAfter,updated_at:new Date().toISOString()}).eq('id',account.id);
      if(aErr) throw aErr;
      const {error:tErr}=await sb.from('virtual_trades').insert({
        user_id,account_id:account.id,position_id:position.id,symbol,market,currency,
        side:'buy',quantity,price_local:price,notional_local:notionalLocal,
        fx_rate_local_to_usd:localToUsdRate(currency,rates),notional_usd:notionalUsd,
        cash_before_usd:cashBefore,cash_after_usd:cashAfter,
        reason:String(body.reason||'virtual buy').slice(0,500)
      });
      if(tErr) throw tErr;
      json(res,200,{ok:true,account:{...account,cash_usd:cashAfter},position,trade:{side:'buy',notional_usd:notionalUsd}});
      return;
    }

    if(action==='sell'){
      const position_id=body.position_id;
      const symbol=cleanSymbol(body.symbol);
      let q=sb.from('virtual_positions').select('*').eq('user_id',user_id).eq('account_id',account.id).eq('status','open');
      if(position_id) q=q.eq('id',position_id); else q=q.eq('symbol',symbol);
      const {data:pos,error:pErr}=await q.limit(1).maybeSingle();
      if(pErr) throw pErr;
      if(!pos){json(res,404,{ok:false,error:'position not found'});return;}
      const currency=normalizeCurrency(pos.currency,pos.market);
      let price=Number(body.price_local);
      if(!Number.isFinite(price)||price<=0){
        const q=await fetchMarketMA(pos.symbol);
        if(!q.ok || !Number.isFinite(Number(q.price))) throw new Error('无法获取当前卖出价格，请稍后重试或手动输入价格');
        price=Number(q.price);
      }
      price=assertPositive(price,'price_local');
      const reqQty=String(body.quantity||'all').toLowerCase()==='all' ? Number(pos.quantity) : assertPositive(body.quantity,'quantity');
      const quantity=Math.min(reqQty,Number(pos.quantity));
      if(quantity<=0 || quantity>Number(pos.quantity)+1e-8){json(res,200,{ok:false,code:'invalid_quantity',error:'卖出数量超出当前持仓'});return;}
      const notionalLocal=price*quantity;
      const proceedsUsd=localToUsd(notionalLocal,currency,rates);
      const cashBefore=Number(account.cash_usd||0);
      const cashAfter=cashBefore+proceedsUsd;
      const oldQty=Number(pos.quantity);
      const remainQty=oldQty-quantity;
      const costUsdSold=Number(pos.cost_usd||0)*(quantity/oldQty);
      const remainCostUsd=Number(pos.cost_usd||0)-costUsdSold;
      const remainCostLocal=Number(pos.cost_local||0)*(remainQty/oldQty);
      const realizedPnlUsd=proceedsUsd-costUsdSold;

      let updatedPosition;
      if(remainQty<=1e-8){
        const {data,error}=await sb.from('virtual_positions').update({
          quantity:0,current_price_local:price,current_value_usd:0,
          pnl_usd:Number(pos.pnl_usd||0)+realizedPnlUsd,
          pnl_pct:Number(pos.cost_usd||0)>0?(Number(pos.pnl_usd||0)+realizedPnlUsd)/Number(pos.cost_usd||0)*100:0,
          status:'closed',closed_at:new Date().toISOString(),updated_at:new Date().toISOString()
        }).eq('id',pos.id).select('*').single();
        if(error) throw error;
        updatedPosition=data;
      }else{
        const currentValueUsd=localToUsd(price*remainQty,currency,rates);
        const {data,error}=await sb.from('virtual_positions').update({
          quantity:remainQty,cost_local:remainCostLocal,cost_usd:remainCostUsd,
          current_price_local:price,current_value_usd:currentValueUsd,
          pnl_usd:currentValueUsd-remainCostUsd,
          pnl_pct:remainCostUsd>0?(currentValueUsd-remainCostUsd)/remainCostUsd*100:0,
          updated_at:new Date().toISOString()
        }).eq('id',pos.id).select('*').single();
        if(error) throw error;
        updatedPosition=data;
      }
      const {error:aErr}=await sb.from('portfolio_accounts').update({cash_usd:cashAfter,updated_at:new Date().toISOString()}).eq('id',account.id);
      if(aErr) throw aErr;
      const {error:tErr}=await sb.from('virtual_trades').insert({
        user_id,account_id:account.id,position_id:pos.id,symbol:pos.symbol,market:pos.market,currency,
        side:'sell',quantity,price_local:price,notional_local:notionalLocal,
        fx_rate_local_to_usd:localToUsdRate(currency,rates),notional_usd:proceedsUsd,
        cash_before_usd:cashBefore,cash_after_usd:cashAfter,
        realized_pnl_usd:realizedPnlUsd,
        reason:String(body.reason||'virtual sell').slice(0,500)
      });
      if(tErr) throw tErr;
      json(res,200,{ok:true,account:{...account,cash_usd:cashAfter},position:updatedPosition,trade:{side:'sell',notional_usd:proceedsUsd,realized_pnl_usd:realizedPnlUsd}});
      return;
    }

    json(res,400,{ok:false,error:'unknown action'});
  }catch(e){
    if(e.code==='setup_missing'){json(res,200,setupMissingPayload(e));return;}
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
