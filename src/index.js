const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const app = express();
const server = require('./server')(app);
const http = require('http');

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

app.post('/slack/oauth', (req, res) => {
    let data =
        {
            form: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: req.query.code
            }
        };

    const request = require('request');
    request.post('https://slack.com/api/oauth.access', data, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let team = JSON.parse(body).team.domain;
            res.redirect('https://' + team + '.slack.com');
        }
    })

});

module.exports = server;