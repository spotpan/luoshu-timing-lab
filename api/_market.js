export function json(res, status, payload){
  res.status(status).json(payload);
}

export function parseBody(req){
  if(!req.body) return {};
  if(typeof req.body === 'string'){
    try{return JSON.parse(req.body || '{}');}catch(e){return {};}
  }
  return req.body;
}

export function cleanSymbol(symbol){
  return String(symbol || '').trim().toUpperCase();
}

export function marketCurrency(market){
  const m=String(market || '').toUpperCase();
  if(m==='CN' || m==='A' || m==='ASHARE') return 'CNY';
  if(m==='HK' || m==='HKG') return 'HKD';
  return 'USD';
}

export function normalizeMarket(symbol, market=''){
  const s=cleanSymbol(symbol);
  const m=String(market || '').toUpperCase();
  if(m) return m==='A' ? 'CN' : m;
  if(/\.HK$/.test(s) || /^\d{5}$/.test(s)) return 'HK';
  if(/\.SH$|\.SZ$/.test(s) || /^\d{6}$/.test(s)) return 'CN';
  return 'US';
}

export function normalizeCurrency(currency, market){
  const c=String(currency || '').toUpperCase();
  if(['USD','CNY','HKD'].includes(c)) return c;
  return marketCurrency(market);
}

export const DEFAULT_SYSTEM_POOL=[
  {symbol:'NVDA', name:'NVIDIA', market:'US', currency:'USD', sector:'AI / Semiconductors', source:'system', priority:100},
  {symbol:'MSFT', name:'Microsoft', market:'US', currency:'USD', sector:'Cloud / AI', source:'system', priority:96},
  {symbol:'AAPL', name:'Apple', market:'US', currency:'USD', sector:'Consumer Hardware', source:'system', priority:92},
  {symbol:'AMD', name:'AMD', market:'US', currency:'USD', sector:'Semiconductors', source:'system', priority:88},
  {symbol:'GOOGL', name:'Alphabet', market:'US', currency:'USD', sector:'Internet / AI', source:'system', priority:86},
  {symbol:'AMZN', name:'Amazon', market:'US', currency:'USD', sector:'Cloud / Commerce', source:'system', priority:84},
  {symbol:'META', name:'Meta', market:'US', currency:'USD', sector:'Internet / AI', source:'system', priority:82},
  {symbol:'TSLA', name:'Tesla', market:'US', currency:'USD', sector:'EV / Robotics', source:'system', priority:80},
  {symbol:'JPM', name:'JPMorgan', market:'US', currency:'USD', sector:'Financials', source:'system', priority:76},
  {symbol:'LLY', name:'Eli Lilly', market:'US', currency:'USD', sector:'Healthcare', source:'system', priority:74},
  {symbol:'XOM', name:'Exxon Mobil', market:'US', currency:'USD', sector:'Energy', source:'system', priority:72},
  {symbol:'KO', name:'Coca-Cola', market:'US', currency:'USD', sector:'Consumer Defensive', source:'system', priority:70},
  {symbol:'00700.HK', name:'腾讯控股', market:'HK', currency:'HKD', sector:'Internet', source:'system', priority:68},
  {symbol:'09988.HK', name:'阿里巴巴-W', market:'HK', currency:'HKD', sector:'E-commerce / Cloud', source:'system', priority:66},
  {symbol:'03690.HK', name:'美团-W', market:'HK', currency:'HKD', sector:'Local Services', source:'system', priority:64},
  {symbol:'300750.SZ', name:'宁德时代', market:'CN', currency:'CNY', sector:'New Energy', source:'system', priority:62},
  {symbol:'002594.SZ', name:'比亚迪', market:'CN', currency:'CNY', sector:'EV / Battery', source:'system', priority:60},
  {symbol:'600519.SH', name:'贵州茅台', market:'CN', currency:'CNY', sector:'Consumer', source:'system', priority:58},
  {symbol:'600036.SH', name:'招商银行', market:'CN', currency:'CNY', sector:'Banking', source:'system', priority:56},
  {symbol:'601899.SH', name:'紫金矿业', market:'CN', currency:'CNY', sector:'Metals', source:'system', priority:54}
];

export async function fetchUsdRates(){
  const fallback={USD:1,CNY:7.2,HKD:7.8};
  try{
    const r=await fetch('https://open.er-api.com/v6/latest/USD',{headers:{'user-agent':'Mozilla/5.0'}});
    if(!r.ok) throw new Error('FX HTTP '+r.status);
    const j=await r.json();
    return {
      USD:1,
      CNY:Number(j?.rates?.CNY)||fallback.CNY,
      HKD:Number(j?.rates?.HKD)||fallback.HKD,
      source:'open.er-api.com',
      fetched_at:new Date().toISOString()
    };
  }catch(e){
    return {...fallback,source:'fallback',fetched_at:new Date().toISOString(),error:e.message||String(e)};
  }
}

export function localToUsd(amountLocal,currency,rates){
  const c=normalizeCurrency(currency,'US');
  if(c==='USD') return Number(amountLocal)||0;
  const rate=Number(rates?.[c]);
  if(!Number.isFinite(rate)||rate<=0) throw new Error('missing FX rate for '+c);
  return (Number(amountLocal)||0)/rate;
}

export function usdToLocal(amountUsd,currency,rates){
  const c=normalizeCurrency(currency,'US');
  if(c==='USD') return Number(amountUsd)||0;
  const rate=Number(rates?.[c]);
  if(!Number.isFinite(rate)||rate<=0) throw new Error('missing FX rate for '+c);
  return (Number(amountUsd)||0)*rate;
}

export function localToUsdRate(currency,rates){
  const c=normalizeCurrency(currency,'US');
  if(c==='USD') return 1;
  const rate=Number(rates?.[c]);
  if(!Number.isFinite(rate)||rate<=0) throw new Error('missing FX rate for '+c);
  return 1/rate;
}
