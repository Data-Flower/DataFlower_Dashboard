const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.listen(port, function () {
    console.log('listening on ', port);
});

app.get('/', function (req, res) {
    html = fs.readFileSync('views/index.html');
    res.writeHead(200);
    // res.render('index');
    res.write(html);
    res.end();
});

app.get('/graph', function (req, res) {
    html = fs.readFileSync('views/graph.html');
    res.writeHead(200);
    res.write(html);
    res.end();
});

app.get('/dynamic-page', (req, res) => {
    const data = {
        name: 'Johns',
        lst: [4, 8, 15, 16, 23, 42, 50, 100]
    };

    const env = {
        nodeParent: 'body',
        nodeTag: 'div',
        nodeId: 'chart',
        nodeClassName: '',

        width: 400,
        height: 600,
        pWidth: 40,
        xInterval: 1,
        pHeight: 5,
        graphColor: 'steelblue',
    }

    // const message = 'This is some dynamic content!';
    // res.writeHead(200);
    res.render('dynamic-page', { data, env });
    // res.end();
});

app.get('/test', function (req, res) {
    res.send('the REST endpoint test run!');
});