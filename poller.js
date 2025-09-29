// poller.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 8082;

// Poll internal in ms
const interval = 50;

function poll() {
  const options = {
    hostname,
    port,
    path: '/command',
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk.toString();
    });

    res.on('end', () => {
      console.log(`Polled command: ${data}`);
    });
  });

  req.on('error', (err) => {
    console.error(`Error polling server: ${err.message}`);
  });

  req.end();
}

// Start polling loop
setInterval(poll, interval);

console.log(`🔄 Polling http://${hostname}:${port}/command every ${interval}ms...`);
