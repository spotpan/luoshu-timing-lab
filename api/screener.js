import { getSupabase, setupMissingPayload, ensureUser } from './_supabase.js';
import { DEFAULT_SYSTEM_POOL, json } from './_market.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');
  try{
    const sb=getSupabase();
    const user_id=String(req.query.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    await ensureUser(sb,user_id);
    const {data:userRows,error}=await sb.from('stock_pool')
      .select('*').eq('user_id',user_id).eq('enabled',true).order('priority',{ascending:false});
    if(error) throw error;
    const items=[...DEFAULT_SYSTEM_POOL,...(userRows||[])].slice(0,80);
    json(res,200,{ok:true,items,note:'前端会调用 /api/ma 为候选标的计算 MA30/MA60 与观察分。'});
  }catch(e){
    if(e.code==='setup_missing'){json(res,200,{...setupMissingPayload(e),items:DEFAULT_SYSTEM_POOL});return;}
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
