import { getSupabase, setupMissingPayload, getOrCreateAccount } from './_supabase.js';
import { fetchUsdRates, localToUsd, json } from './_market.js';
import { fetchMarketMA } from './_quote.js';

async function refreshOpenPositions(sb, positions, rates){
  const refreshed=[];
  for(const p of positions){
    if(p.status!=='open'){
      refreshed.push(p);
      continue;
    }
    try{
      const q=await fetchMarketMA(p.symbol);
      if(!q.ok || !Number.isFinite(Number(q.price))){
        refreshed.push({...p, quote_error:q.error||q.message||'quote unavailable'});
        continue;
      }
      const price=Number(q.price);
      const qty=Number(p.quantity||0);
      const valueUsd=localToUsd(price*qty,p.currency,rates);
      const costUsd=Number(p.cost_usd||0);
      const pnl=valueUsd-costUsd;
      const pnlPct=costUsd>0?pnl/costUsd*100:0;
      const patch={current_price_local:price,current_value_usd:valueUsd,pnl_usd:pnl,pnl_pct:pnlPct,updated_at:new Date().toISOString()};
      const {data,error}=await sb.from('virtual_positions').update(patch).eq('id',p.id).select('*').single();
      if(error){refreshed.push({...p,...patch,quote_error:error.message});}
      else{refreshed.push({...data,quote:q});}
    }catch(e){
      refreshed.push({...p,quote_error:e.message||String(e)});
    }
  }
  return refreshed;
}

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','no-store');
  try{
    const sb=getSupabase();
    const user_id=String(req.query.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    const refresh=String(req.query.refresh||'1')!=='0';
    const account=await getOrCreateAccount(sb,user_id,100000);
    const {data:positionsRaw,error:pErr}=await sb.from('virtual_positions')
      .select('*').eq('user_id',user_id).eq('account_id',account.id).neq('status','reset').order('opened_at',{ascending:false});
    if(pErr) throw pErr;
    const rates=await fetchUsdRates();
    const positions=refresh ? await refreshOpenPositions(sb,positionsRaw||[],rates) : (positionsRaw||[]);
    const open=positions.filter(p=>p.status==='open');
    const holdingValue=open.reduce((s,p)=>s+Number(p.current_value_usd||0),0);
    const totalAsset=Number(account.cash_usd||0)+holdingValue;
    json(res,200,{ok:true,account,positions,fx:rates,summary:{cash_usd:Number(account.cash_usd||0),holding_value_usd:holdingValue,total_asset_usd:totalAsset,pnl_usd:totalAsset-Number(account.initial_cash_usd||0),pnl_pct:Number(account.initial_cash_usd||0)>0?(totalAsset-Number(account.initial_cash_usd||0))/Number(account.initial_cash_usd||0)*100:0,open_count:open.length,refreshed_at:new Date().toISOString()}});
  }catch(e){
    if(e.code==='setup_missing'){json(res,200,setupMissingPayload(e));return;}
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
