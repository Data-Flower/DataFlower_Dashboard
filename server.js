const express = require('express');
const path = require('path');
const mime = require('mime-types');
const app = express();

const fs = require('fs');
const port = 8080;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/css/style.css', (req, res) => {
    console.log(path.join(__dirname, 'css', 'style.css'));
    res.sendFile(path.join(__dirname, 'css', 'style.css'));
});

app.listen(port, function () {
    console.log('listening on ', port);
});

app.get('/', function (req, res) {
    html = fs.readFileSync('samples/index.html');
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

app.get('/apex/1', (req, res) => {
    html = fs.readFileSync('views/apexbasic.html');
    res.writeHead(200);
    // res.render('index');
    res.write(html);
    res.end();
});

// app.get('/apex/line/:id', (req, res) => {
//     const id = req.params.id;
//     // console.log(`id: ${id}`);

//     let filePath = `views/apex/line/apex_line_${id}.html`;
//     console.log(`filePath: ${filePath}`);

//     // html = fs.readFileSync(`views/apex/line/apex_line_${id}.html`);

//     res.sendFile(path.join(__dirname, `views/apex/line/apex_line_${id}.html`));

//     // res.render('apex/line/apex_line_2');
//     // res.render('index');

//     // res.write(html);
//     // res.end(); 
// });


// app.get('/apex/area/:id', (req, res) => {
//     const id = req.params.id;

//     let filePath = `views/apex/area/apex_area_${id}.html`;
//     console.log(`filePath: ${filePath}`);

//     res.sendFile(path.join(__dirname, filePath));
//     // 1 area
//     // 2 spline
// });

app.get('/apex/:tp/:id', (req, res) => {
    const tp = req.params.tp;
    const id = req.params.id;

    // console.log('hello');
    let filePath = `samples/apex/${tp}/apex_${tp}_${id}.html`;
    console.log(`filePath: ${filePath}`);

    res.sendFile(path.join(__dirname, filePath));
});