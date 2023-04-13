const express = require('express');
const path = require('path');
// const mime = require('mime-types');

const app = express();
app.set("view engine", "ejs");

const fs = require('fs');
const port = 8080;

app.use(express.static(path.join(__dirname, '/public/')));

// const data = {
//     title: 'My Page Title',
//     content: 'This is my page content.',
// };
// res.render('index', data);

// app.get('/pages/home', (req, res) => {

//     res.render('pages/home');
// });

// app.get('/pages/about', (req, res) => {
//     res.render('pages/about');
// });

app.get('/css/:name.css', (req, res) => {
    const name = req.params.name;

    console.log(path.join(__dirname, 'css', `${name}.css`));
    res.sendFile(path.join(__dirname, 'css', `${name}.css`));
});

app.get('/icons/:name.png', (req, res) => {
    const name = req.params.name;

    // console.log(path.join(__dirname, `icons/${name}.png`));
    res.sendFile(path.join(__dirname, `icons/${name}.png`));
});

app.get('/pages/:name', (req, res) => {

    const name = req.params.name;

    console.log(path.join(__dirname, `pages/${name}.ejs`));
    // res.sendFile(path.join(__dirname, `pages/${name}.html`));
    res.render(`pages/${name}`);
});

app.listen(port, function () {
    console.log('listening on ', port);
});

// app.get('/pages/samples', function (req, res) {
//     // html = fs.readFileSync('samples/index.html');
//     // res.writeHead(200);
//     // // res.render('index');
//     // res.write(html);
//     // res.end();
//     res.render('pages/samples');
// });

app.get('/apex/:tp/:id', (req, res) => {
    const tp = req.params.tp;
    const id = req.params.id;

    // console.log('hello');
    // let filePath = `samples/apex/${tp}/apex_${tp}_${id}.html`;
    // console.log(`filePath: ${filePath}`);

    // res.sendFile(path.join(__dirname, filePath));

    console.log(path.join(__dirname, `samples/apex/${tp}/apex_${tp}_${id}.ejs`));

    res.render(`samples/${tp}/apex_${tp}_${id}`);
});