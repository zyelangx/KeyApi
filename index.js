/*
Credit : By ZyelangX
*/

__path = process.cwd()
const express = require('express')
const app = express()
const cors = require('cors')
const cron = require('node-cron');
const fs = require("fs");
const bodyParser = require('body-parser')
const randomstring = require('randomstring')


// Ubah Auth Bebas
const Authz = "ZyeLangX"

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


// Get AuthKey
app.post('/getAuthKey', async (req, res) => {
    let _config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const { auth } = req.body
    if (!auth) {
        return res.status(404).json({
            status: 404,
            msg: 'body auth not found!'
        })
    }

    if (auth === Authz) {
        var AuthKey = randomstring.generate('9')
        // edit or add property
        _config.AuthKey = AuthKey;
        //write file
        fs.writeFileSync('config.json', JSON.stringify(_config, 0));
        res.status(200).json({
            status: 200,
            AuthKey
        })
    } else {
        res.status(500).json({
            status: 500,
            msg: 'Auth Invalid!'
        })
    }
})
// Get Apikey
app.post('/getKey', (req, res) => {
    const { authkey } = req.body


    if (!authkey) {
        return res.status(404).json({
            status: 404,
            msg: 'body authkey not found!'
        })
    }
    let _configs = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (authkey === _configs.AuthKey) {
        res.status(200).json({
            status: 200,
            apiKey: _configs.apiKey
        })
        // Auto New Key
        var AuthKey = randomstring.generate('9')
        // edit or add property
        _configs.AuthKey = AuthKey;
        //write file
        fs.writeFileSync('config.json', JSON.stringify(_configs, 0));
    } else {
        res.status(500).json({
            status: 500,
            msg: 'AuthKey Invalid!'
        })
    }
})

// Reset Key 24 Jam
cron.schedule('00 00 * * *', function () {
    let _config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    var apiKeys = randomstring.generate(8)
    _config.apiKey = apiKeys;
    //write file
    fs.writeFileSync('config.json', JSON.stringify(_config, 0));
    console.log('ApiKey Update : ' + apiKeys);
})

// Views
// app.get('/', (req, res) => {
//     res.sendFile(__path + "/views/index.html")
// })

app.listen('8000', () => {
    console.log('Server Running Port ' + 8000)
})
