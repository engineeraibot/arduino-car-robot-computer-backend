// poller.js
const http = require('http');
const { SerialPort } = require('serialport');

const hostname = '127.0.0.1';
const port = 8082;

// Poll interval in ms
const interval = 50;

// Configure the serial port
const serialPort = new SerialPort({
  path: 'COM3', // <-- Replace with your serial port, e.g. "COM3" on Windows, "/dev/ttyUSB0" on Linux, "/dev/tty.usbserial-xxx" on macOS
  baudRate: 9600, // Adjust depending on your hardware requirements
});

// Polling function
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
      const message = `${data}.`; // Append "." as marker
      console.log(`Polled command: ${message}`);

      if (serialPort.isOpen) {
        serialPort.write(message, (err) => {
          if (err) {
            console.error(`Error writing to serial port: ${err.message}`);
          }
        });
      } else {
        console.warn('⚠️ Serial port not open, cannot send data.');
      }
    });
  });

  req.on('error', (err) => {
    console.error(`Error polling server: ${err.message}`);
  });

  req.end();
}

// Open serial port
serialPort.on('open', () => {
  console.log(`🔌 Serial port ${serialPort.path} opened at ${serialPort.settings.baudRate} baud`);
});

// Handle serial port errors
serialPort.on('error', (err) => {
  console.error(`Serial port error: ${err.message}`);
});

// Start polling loop
setInterval(poll, interval);

console.log(`🔄 Polling http://${hostname}:${port}/command every ${interval}ms...`);
