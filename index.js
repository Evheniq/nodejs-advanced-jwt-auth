require('dotenv').config();
const express = require('express');
const Router = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestLogger = require('./Middlewares/requestLogger');
const {resetDatabases, tokenCleaner} = require('./utils');
const errorHandler = require('./Middlewares/errorHandler')
const refresherToken = require('./Middlewares/refresherToken');
const authRequired = require('./Middlewares/authRequired');

// resetDatabases();
tokenCleaner(); // Cleaner for old refresh tokens from DB.

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestLogger);

/*
  I created 2 separate middleware(authRequired, refresherToken) to flexibly manage page access and token refresh.
  For example, for a blog, everyone will be allowed to visit posts without authorization.
  If a person is authorized, then his token will be updated on the posts page.
  But for the post creation page - we need authorization.

  As you can see, the set of urls is not the same for updating tokens and required authorization in real project
 */
app.use(authRequired({forbidden: ['/signin', '/signup', '/logout']}));
app.use(refresherToken({forbidden: ['/signin', '/signup', '/logout']}));

app.use(Router);
app.use(errorHandler);

app.listen(PORT, () => console.log(`NodeJS server started on port ${PORT}...`));