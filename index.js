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
app.use(cors());

routesApi(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});