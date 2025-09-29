// 代码生成时间: 2025-09-29 15:28:44
// Import necessary Meteor packages and Node modules
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import http2 from 'http2';

// HTTP/2 protocol handler function
function handleHttpRequest(req, res) {
  // Check if the request is an HTTP/2 request
  if (req.httpVersion === '2.0') {
    // Handle HTTP/2 specific logic here
    console.log('HTTP/2 request received:', req.url);

    // Respond with a 200 OK status and a simple message
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('HTTP/2 request processed successfully');
  } else {
    // If not an HTTP/2 request, send an error message
    res.writeHead(426, { 'Content-Type': 'text/plain' });
    res.end('Upgrade required. Please use HTTP/2.');
  }
}

// Configure the WebApp to use HTTP/2
WebApp.connectHandlers.use((req, res) => {
  // Use the http2 wrapper to handle the request
  const server = http2.createServer({});

  // Handle the request using the server's request listener
  server.emit('request', req, res);

  // Catch any unhandled errors
  server.on('error', (error) => {
    console.error('HTTP/2 server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });

  // Call the HTTP/2 protocol handler function
  handleHttpRequest(req, res);
});

// Start the Meteor server
Meteor.startup(() => {
  console.log('Meteor server started with HTTP/2 support.');
});