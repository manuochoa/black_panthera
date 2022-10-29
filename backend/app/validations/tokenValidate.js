const jwt = require("jsonwebtoken");
const { env } = require("../../environment");
const SHA256 = require("crypto-js/sha256");
const { getToken } = require("../model/blacklistTokenModel");
const logger = require("../../logger");

const validateToken = async (ctx, next) => {
  if (
    !ctx.request.headers.authorization ||
    !ctx.request.headers.authorization.startsWith("Bearer") ||
    !ctx.request.headers.authorization.split(" ")[1]
  ) {
    logger.error("token not found");
    ctx.status = 401;
    ctx.body = {
      response: "failure",
      error: "please login",
    };
  } else {
    const theToken = ctx.request.headers.authorization.split(" ")[1];
    const check = await getToken(theToken);
    if (check.length > 0) {
      logger.error("token expired");
      ctx.status = 401;
      ctx.body = {
        response: "failure",
        error: "unathorized attempt",
      };
    } else {
      return jwt.verify(
        theToken,
        JSON.stringify(SHA256(env.ADMIN_TOKEN).words),
        (err, decoded) => {
          if (decoded) {
            return next();
          }
          if (err) {
            logger.error("invalid token");
            ctx.status = 401;
            ctx.body = {
              response: "failure",
              error: "unathorized attempt",
            };
          }
        }
      );
    }
  }
};
module.exports = {
  validateToken,
};
