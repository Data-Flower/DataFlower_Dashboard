const AWS = require('aws-sdk');
const express = require('express');
const path = require('path');

const app = express();
app.set("view engine", "ejs");

require('dotenv').config();
const fs = require('fs');
const port = 8080;

app.use(express.static(path.join(__dirname, '/public/')));

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new AWS.S3();

app.get('/data/NH/test', (req, res) => {
    console.log(process.env.Hello);
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    console.log(process.env.AWS_BUCKET_NAME);
    console.log(process.env.AWS_BUCKET_KEY_1);
    console.log(process.env.AWS_BUCKET_KEY_2);
    console.log(process.env.AWS_BUCKET_KEY_3);
    // res.send('Hello World!');

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = process.env.AWS_BUCKET_KEY_3;

    const params = {
        Bucket: bucketName,
        Key: key
    }

    var _data = {};

    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(data.Body.toString());
            _data = data.Body.toString();
            res.send(_data);
        }
    });
});

app.get('/data/NH/:id', (req, res) => {

    const id = req.params.id;
    const bucketName = process.env.AWS_BUCKET_NAME;

    let key = '';
    switch (id) {
        case '1':
            key = process.env.AWS_BUCKET_KEY_1;
            break;
        case '2':
            key = process.env.AWS_BUCKET_KEY_2;
            break;
        case '3':
            key = process.env.AWS_BUCKET_KEY_3;
            break;
    }

    const params = {
        Bucket: bucketName,
        Key: key
    }

    var _data = {};

    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(data.Body.toString());
            _data = data.Body.toString();
            res.send(_data);
        }
    });

    // res.send(key);
});

app.get('/', (req, res) => {

    res.render('pages/home');
});

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

app.get('/icons/:name.svg', (req, res) => {
    const name = req.params.name;

    // console.log(path.join(__dirname, `icons/${name}.png`));
    res.sendFile(path.join(__dirname, `icons/${name}.svg`));
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