import { fetchMarketMA } from './_quote.js';

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=600, stale-while-revalidate=1800');
  const symbol=String(req.query.symbol||'').trim();
  if(!symbol){
    res.status(400).json({ok:false,error:'missing symbol'});
    return;
  }
  const out=await fetchMarketMA(symbol);
  res.status(200).json(out);
}
