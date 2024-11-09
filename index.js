const express = require("express");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const port = 3000;

const database = require("./config/database");
database.connect();

app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const routeClient = require("./routes/client/index.route");
routeClient(app);


app.set('views', `${__dirname}/views`); //Tìm đến thư mục tên là view
app.set('view engine', 'pug')// template engine sử dụng là pug
app.use(express.static(`${__dirname}/public`))// thiết lập thư mục chứa file tĩnh

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});