require('dotenv').config();
const express = require('express');
const Router = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestLogger = require('./Middlewares/requestLogger');
const {resetDatabases, tokenCleaner} = require('./utils');
const errorHandler = require('./Middlewares/errorHandler')
const refresherToken = require('./Middlewares/refresherToken');

// resetDatabases();
tokenCleaner(); // Cleaner for old refresh tokens from DB.

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestLogger);
app.use(refresherToken);
app.use(Router);
app.use(errorHandler);

/* TODO check all code status response */
app.listen(PORT, () => console.log(`NodeJS server started on port ${PORT}...`));