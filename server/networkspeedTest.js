const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();
 
getNetworkDownloadSpeed();
 
async function getNetworkDownloadSpeed() {
  const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
  const fileSizeInBytes = 50000000;
  const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
  console.log(speed.mbps);
}
 