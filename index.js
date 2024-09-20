const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors')
const database = require("./config/database.js");
const routesApi = require("./routers/client/index.route.js");

database.connect();



const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//CORS
// Cach 1 : Tat ca cac ten mien deu duoc phep truy cap
// app.use(cors()); 

//Cach 2 : Ap dung cho 1 ten mien cu the
// var corsOptions = {
//     origin: 'http://abc.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));


routesApi(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});