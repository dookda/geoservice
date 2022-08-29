const express = require('express');
const app = express.Router();
const con = require("./db");
const db = con.db;


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