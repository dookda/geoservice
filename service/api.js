const express = require('express');
const app = express.Router();
const con = require("./db");
const db = con.db;

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const config = require("./config.json");
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
        client.pushMessage(userId, msg)
        // res.status(200).send();
        res.sendStatus(200)
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

app.post("/api/insertuser", async (req, res) => {
    const { usrid, data } = req.body;
    await db.query(`INSERT INTO joomana_line_noti(usrid, ts)VALUES('${usrid}', now())`)

    let d;
    for (d in data) {
        if (data[d] !== '') {
            let sql = `UPDATE joomana_line_noti SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
            await db.query(sql)
        }
    }
    res.status(200).json({
        data: "success"
    })
});

app.post("/api/getuser", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT * FROM joomana_line_noti WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
});

app.post("/api/updateuser", (req, res) => {
    const { usrid, data } = req.body;
    const sql = `SELECT * FROM joomana_line_noti WHERE usrid='${usrid}'`;
    let d;
    db.query(sql).then(r => {
        if (r.rows.length > 0) {
            for (d in data) {
                if (data[d] !== '') {
                    let sql = `UPDATE joomana_line_noti SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
                    console.log(sql);
                    db.query(sql)
                }
            }
        } else {
            db.query(`INSERT INTO joomana_line_noti(usrid, ts)VALUES('${usrid}', now())`).then(() => {
                for (d in data) {
                    if (data[d] !== '') {
                        let sql = `UPDATE joomana_line_noti SET ${d}='${data[d]}', ts=now() WHERE usrid='${usrid}'`;
                        db.query(sql)
                    }
                }
            })
        }
        res.status(200).json({ data: "success" })
    })
});


module.exports = app;