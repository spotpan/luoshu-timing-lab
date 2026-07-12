import { getSupabase, setupMissingPayload, getOrCreateAccount } from './_supabase.js';
import { json } from './_market.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','no-store');
  try{
    const sb=getSupabase();
    const user_id=String(req.query.user_id || req.headers['x-luoshu-user'] || '').trim();
    if(!user_id){json(res,400,{ok:false,error:'missing user_id'});return;}
    const account=await getOrCreateAccount(sb,user_id,100000);
    const {data:positions,error:pErr}=await sb.from('virtual_positions')
      .select('*').eq('user_id',user_id).eq('account_id',account.id).neq('status','reset').order('opened_at',{ascending:false});
    if(pErr) throw pErr;
    const open=(positions||[]).filter(p=>p.status==='open');
    const holdingValue=open.reduce((s,p)=>s+Number(p.current_value_usd||0),0);
    const totalAsset=Number(account.cash_usd||0)+holdingValue;
    json(res,200,{ok:true,account,positions:positions||[],summary:{
      cash_usd:Number(account.cash_usd||0),
      holding_value_usd:holdingValue,
      total_asset_usd:totalAsset,
      pnl_usd:totalAsset-Number(account.initial_cash_usd||0),
      pnl_pct:Number(account.initial_cash_usd||0)>0?(totalAsset-Number(account.initial_cash_usd||0))/Number(account.initial_cash_usd||0)*100:0,
      open_count:open.length
    }});
  }catch(e){
    if(e.code==='setup_missing'){json(res,200,setupMissingPayload(e));return;}
    json(res,500,{ok:false,error:e.message||String(e)});
  }
}
