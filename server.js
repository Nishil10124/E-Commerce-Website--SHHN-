const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const serveStatic = require('serve-static');

const app = express();

// Enable logging
app.use(morgan('dev'));

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure static file serving
const staticOptions = {
    etag: true,
    lastModified: true,
    maxAge: '1h',
    setHeaders: (res, path) => {
        // Set proper content types
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        }
        
        // Enable CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
};

// Serve static files from different directories with specific configurations
app.use('/js', serveStatic(path.join(__dirname, 'js'), staticOptions));
app.use('/css', serveStatic(path.join(__dirname, 'css'), staticOptions));
app.use('/img', serveStatic(path.join(__dirname, 'img'), staticOptions));
app.use(serveStatic(__dirname, staticOptions));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Handle 404 errors
app.use((req, res) => {
    console.log('404 - Not Found:', req.url);
    res.status(404).json({
        error: 'Not Found',
        message: `The requested URL ${req.url} was not found`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server directory: ${__dirname}`);
    console.log('Available static directories:');
    console.log(`- JS files: ${path.join(__dirname, 'js')}`);
    console.log(`- CSS files: ${path.join(__dirname, 'css')}`);
    console.log(`- Image files: ${path.join(__dirname, 'img')}`);
}); 