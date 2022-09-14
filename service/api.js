const express = require('express');
const app = express.Router();
const con = require("./db");
const db = con.db;

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const config = require("./config.json");
const axios = require('axios');
const client = new line.Client(config);

app.post("/api/pushmsg", (req, res) => {
    // console.log(req.body);
    let { userId } = req.body;
    const msg = [{
        type: 'text',
        text: 'มีรายงานจมน้ำเข้ามา เข้าไปดูที่ http://103.40.148.140/jomnam'
    }, {
        type: 'sticker',
        packageId: '11537',
        stickerId: "52002738"
    }];

    if (userId) {
        // console.log(userId);
        // userId = 'U176de9c656286feb470b121c184e1356'
        client.pushMessage(userId, msg)
        res.status(200).send();
    }

});

app.get("/api/utm2latlon/:e/:n", (req, res) => {
    const e = req.params.e;
    const n = req.params.n;
    const sql = `SELECT ST_Y(d.geom) as lat, ST_X(d.geom) as lon  FROM (SELECT ST_Transform(
        ST_GeomFromText('POINT(${e} ${n})', 32647), 4326) as geom) d `;
    db.query(sql).then((r) => {
        res.status(200).json({
            data: r.rows
        });
    });
})


module.exports = app;