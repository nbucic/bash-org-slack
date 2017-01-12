const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const app = express();
const server = require('./server')(app);

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    bodyParser.json()
);

app.post('/slack/receive', (req, res) => {
    if (/^(\d+|random)$/.test(req.body.text)) {
        http.get(`http://bash.org/?${req.body.text}`, (response) => {
            let data;

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                let $ = cheerio.load(data, {normalizeWhiteSpace: true});
                let quote = $('.qt').first().text();
                if (!quote) {
                    quote = "BRO, no such message, try random instead"
                } else {
                    let quoteNumber = $('.quote a').first().text();
                    quote = `${quoteNumber} - ${quote}`;
                }
                let response = {
                    response_type: 'in_channel',
                    text: quote
                };
                res.json(response);
            });
        });
    } else {
        res.send("BRO!!!! Behave. <integer> || \"random\"");
    }
});

module.exports = server;