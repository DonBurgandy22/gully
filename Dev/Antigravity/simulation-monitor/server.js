const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8006;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
    // Serve index.html for all routes
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found, serve index.html
            serveFile(path.join(__dirname, '/index.html'), res);
            return;
        }
        
        // Serve the requested file
        serveFile(fullPath, res);
    });
});

function serveFile(filePath, res) {
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                // File not found
                res.writeHead(404);
                res.end('File not found');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            // Success
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
}

server.listen(PORT, HOST, () => {
    console.log(`Simulation Monitor running at http://${HOST}:${PORT}`);
    console.log(`Local access: http://localhost:${PORT}`);
    console.log(`External access: Use localtunnel or ngrok to expose`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down simulation monitor...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});