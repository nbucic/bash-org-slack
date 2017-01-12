const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cheerio = require('cheerio');

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    bodyParser.json()
);

app.get('/', (req, res) => res.send('HERE'));

app.post('/', (req, res) => res.send('POST'));

app.post('/slack/receive', (req, res) => {
    if (/^(\d+|random)$/.test(req.body.text)) {
        http.get(`http://bash.org/?${req.body.text}`, (response) => {
            let data;

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                let $ = cheerio.load(data, {normalizeWhiteSpace: true});
                let quoteNumber = $('.quote a').first().text();
                let quote = $('.qt').first().text();
                if (!quote) {
                    quote = "BRO, no such message, try random instead"
                } else {
                    quote = `${quoteNumber} - ${quote}`;
                }
                let response = {
                    response_type: 'in_channel',
                    text: quote
                };
                res.json(response);
            });
        }, (err) => {
            console.log(err);
        });
    } else {
        res.send("BRO!!!! Behave. <integer> || \"random\"");
    }
});

module.exports = app;