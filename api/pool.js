import { getSupabase, setupMissingPayload, ensureUser } from './_supabase.js';
import { DEFAULT_SYSTEM_POOL, parseBody, cleanSymbol, normalizeMarket, normalizeCurrency, json } from './_market.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type,X-Luoshu-User');
  if(req.method==='OPTIONS'){res.status(204).end();return;}
  try{
    const sb=getSupabase();
    const body=parseBody(req);
    const user_id=String(req.query.user_id || body.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    await ensureUser(sb,user_id);

    if(req.method==='POST'){
      const action=String(body.action||'add');
      if(action==='delete'){
        const id=body.id;
        const symbol=cleanSymbol(body.symbol);
        let q=sb.from('stock_pool').update({enabled:false}).eq('user_id',user_id).eq('source','user');
        if(id) q=q.eq('id',id); else q=q.eq('symbol',symbol);
        const {error}=await q;
        if(error) throw error;
        json(res,200,{ok:true});
        return;
      }
      const symbol=cleanSymbol(body.symbol);
      if(!symbol){json(res,400,{ok:false,error:'missing symbol'});return;}
      const market=normalizeMarket(symbol,body.market);
      const currency=normalizeCurrency(body.currency,market);
      const row={
        user_id,
        symbol,
        market,
        currency,
        name:String(body.name||symbol).trim(),
        sector:String(body.sector||'').trim(),
        source:'user',
        enabled:true,
        priority:Number(body.priority||50)
      };
      const {data,error}=await sb.from('stock_pool').upsert(row,{onConflict:'user_id,symbol'}).select('*').single();
      if(error) throw error;
      json(res,200,{ok:true,item:data});
      return;
    }

    const {data:userRows,error}=await sb.from('stock_pool')
      .select('*').eq('user_id',user_id).eq('enabled',true).order('created_at',{ascending:false});
    if(error) throw error;
    json(res,200,{ok:true,system:DEFAULT_SYSTEM_POOL,user:userRows||[],items:[...DEFAULT_SYSTEM_POOL,...(userRows||[])]});
  }catch(e){
    if(e.code==='setup_missing'){
      json(res,200,{...setupMissingPayload(e),system:DEFAULT_SYSTEM_POOL,user:[],items:DEFAULT_SYSTEM_POOL});
      return;
    }
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
