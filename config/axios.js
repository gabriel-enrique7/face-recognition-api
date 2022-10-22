const axios = require("axios")
require("dotenv").config()

const http = axios.create({
    baseURL: process.env.BASE_URL_MS
});

module.exports = http;