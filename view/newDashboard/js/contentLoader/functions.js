// ========Parse Json===============
const isJsonString = (str) => {
  let parsed
  try {
    parsed = JSON.parse(str);
  } catch (e) {
    return str;
  }
  return parsed;
}


// ==========Date Function===========
const getDate = ()=>{
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
    const d = new Date();
    let month = months[d.getMonth()];
    let currentDate = `${d.getDate()} ${month} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    return currentDate
  }


// ========= API Routes ================
const routes = {
  'baseUrl': 'http://localhost:8080/',
  'apiRoute': {
    'netwokInterfaces': 'api/network',
    'systemInformation': 'api/sysinfo',
    'cpuInfo': 'api/cpu',
    'memoryInfo': 'api/memory',
    'diskInfo': 'api/disk',
    'inputOutputReport': 'api/traffic',
    'logRecord': 'api/log',
  }
}
  