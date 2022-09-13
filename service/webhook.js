const express = require('express');
const app = express.Router();

const line = require("@line/bot-sdk");
const middleware = require('@line/bot-sdk').middleware
const config = require("./config.json")
const client = new line.Client(config);

app.post('/webhook', middleware(config), async (req, res) => {
    res.sendStatus(200)
    const e = req.body.events[0];
    console.log(e)
    if (e.type === 'message' && e.message.type === 'text') {
        handleMessageEvent(e);
    } else {
        return Promise.resolve(null);
    }
})

const handleMessageEvent = async (e) => {

    if (e.message.text === 'hello') {

        const msg = {
            "type": "text",
            "text": `มีรายงานใหม่ http://103.40.148.140/jomnam/index.html`,
            "emojis": [
                {
                    "index": 0,
                    "productId": "5ac1bfd5040ab15980c9b435",
                    "emojiId": "174"
                }
            ]
        }
        return client.replyMessage(e.replyToken, msg);
    }
}

module.exports = app;