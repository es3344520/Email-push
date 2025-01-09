const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
const SENDCLOUD_API_USER = process.env.SENDCLOUD_API_USER;
const SENDCLOUD_API_KEY = process.env.SENDCLOUD_API_KEY;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER; 

app.get('/taobao', async (req, res) => {
    try {
        const response = await axios.get(`https://ipinfo.io?token=${IPINFO_TOKEN}`);
        const ipData = response.data;

        const mailOptions = {
            apiUser: SENDCLOUD_API_USER,
            apiKey: SENDCLOUD_API_KEY,
            to: EMAIL_RECEIVER,
            from: 'SendCloud@eixcst.sendcloud.org',
            subject: '新用户访问通知',
            html: `<p>B用户的访问数据如下：</p><pre>${JSON.stringify(ipData, null, 2)}</pre>`
        };

        const mailResponse = await axios.post(
            'https://api.sendcloud.net/apiv2/mail/send',
            querystring.stringify(mailOptions)
        );

        res.send('链接失效了，重新获取吧');
    } catch (error) {
        console.error(error);
        res.status(500).send('出现错误，请稍后再试。');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`应用正在运行在端口 ${PORT}`);
});
