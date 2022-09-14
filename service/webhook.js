const express = require('express');
const app = express.Router();

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const config = require("./config.json")
const client = new line.Client(config);

app.post('/webhook', middleware(config), async (req, res) => {
    res.sendStatus(200)
    if (req.body.events[0].type === 'message' && req.body.events[0].message.type === 'text') {
        handleMessageEvent(req.body.events[0]);
    } else {
        return Promise.resolve(null);
    }
})

const handleMessageEvent = async (e) => {
    // console.log(e);
    if (e.message.text === 'hello') {
        const msg = {
            type: 'text',
            text: 'hello, how are you?'
        }
        return client.replyMessage(e.replyToken, msg);
    }
}

module.exports = app;