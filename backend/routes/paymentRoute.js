const express = require('express');
const payment_route = express();

const body_parser = require('body-parser');
payment_route.use(body_parser.json());
payment_route.use(body_parser.urlencoded({extended:false}));

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname,'../views'))