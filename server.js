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

//#region S3

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

function _getData(id) {
    // const id = req.params.id;
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

    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                // console.log(data.Body.toString());
                // _data = data.Body.toString();
                // resolve(_data);
                resolve(data.Body.toString());
            }
        });
    });

    // var _data = {};

    // s3.getObject(params, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         // console.log(data.Body.toString());
    //         _data = data.Body.toString();
    //         // res.send(_data);
    //         // console.log(_data);
    //         return _data;
    //     }
    // });
    // console.log(_data);
}

//#endregion S3

//#region datas

app.get('/data/1', (req, res) => {
    // 111 s3 데이터를 받는다 (1번꺼)
    _getData('1')
        .then((data) => {
            res.setHeader('Content-Type', 'application/json');

            // console.log(data);
            data = JSON.parse(data);

            // ------------------------------

            // 222 이걸 가공한다
            const minmaxData = {};
            const meanData = {};

            // minmaxData, meanData 데이터 가공
            for (const key in data) {
                const value = data[key];
                // console.log(value);
                // console.log('(분류, name)품목-품종-등급 : ', `${value.PUMMOK}-${value.PUMJONG}-${value.DDD}`);
                // console.log('(x축 값)날짜 : ', value.ADJ_DT);
                // console.log('(y축 값)최소, 최대값 : ', [value.MIN, value.MAX]);
                // console.log('(y축 값)평균값 : ', value.MEAN);
                newKey = `${value.PUMMOK}-${value.PUMJONG}-${value.DDD}`;

                // 최소, 최대값 정리
                _minmaxData = {
                    x: value.ADJ_DT,
                    y: [value.MIN, value.MAX]
                }

                // 평균값 정리
                _meanData = {
                    x: value.ADJ_DT,
                    y: value.MEAN
                }

                // 초기 할당 데이터의 경우 리스트 생성
                if (minmaxData[newKey] === undefined) {
                    minmaxData[newKey] = [];
                }
                if (meanData[newKey] === undefined) {
                    meanData[newKey] = [];
                }

                // 데이터 추가
                minmaxData[newKey].push(_minmaxData);
                meanData[newKey].push(_meanData);
            }
            // console.log(newData);

            // 333 최종 전달할 json 데이터 프레임 가져온다
            const series = [];

            // 444 거기 데이터 영역에 가공한 데이터 박는다
            // 최소, 최대값 정리
            for (const key in minmaxData) {
                const value = minmaxData[key];
                // console.log(key);   // key: (분류, name)품목-품종-등급 -> name
                // console.log(value); // value: (x축 값)날짜, (y축 값)최소, 최대값 -> data
                // console.log('---------------------');

                series.push({
                    type: 'rangeArea',
                    name: key,
                    data: value
                });
            }
            // 평균값 정리
            for (const key in meanData) {
                const value = meanData[key];
                // console.log(key);   // key: (분류, name)품목-품종-등급 -> name
                // console.log(value); // value: (x축 값)날짜, (y축 값)평균값 -> data
                // console.log('---------------------');

                series.push({
                    type: 'line',
                    name: key,
                    data: value
                });
            }
            // console.log(series);

            // ------------------------------

            // console.log(typeof series)

            // 5 전달
            res.json(series);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

//#endregion datas

app.get('/', (req, res) => {

    res.render('pages/home');
});

//#region files

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

//#endregion files


app.listen(port, function () {
    console.log('listening on ', port);
});

//#region pages

app.get('/pages/:name', (req, res) => {

    const name = req.params.name;

    console.log(path.join(__dirname, `pages/${name}.ejs`));
    // res.sendFile(path.join(__dirname, `pages/${name}.html`));
    res.render(`pages/${name}`);
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

//#endregion pages
