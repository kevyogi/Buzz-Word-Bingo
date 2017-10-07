const express = require('express');
let app = express();
let PORT = process.env.PORT || 3000;

app.use(express.static('public'));