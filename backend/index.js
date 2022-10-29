/*********** import starts ***********/
("use strict");
const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { router } = require("./app/routes");
const { env } = require('./environment')
const logger = require('./logger');
const { connectDB } = require("./app/utils/db");

const app = new koa();

connectDB()
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());


const server = app.listen(env.PORT, () =>
    logger.info(`Server has started. ${env.PORT}`)
);


