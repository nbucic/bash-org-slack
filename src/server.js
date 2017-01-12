const http = require('http');
const https = require('https');

const createServer = (app) => {
    if (process.env.NODE_ENV === 'production') {
        let options = {
            key: fs.readFileSync(process.env.SSL_KEY),
            ca: fs.readFileSync(process.env.SSL_CA),
            cert: fs.readFileSync(process.env.SSL_CERT)
        };
        return https.createServer(options, app);
    } else {
        return http.createServer(app);
    }
};

module.exports = createServer;