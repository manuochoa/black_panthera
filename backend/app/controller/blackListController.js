const { createBlacklistToken } = require("../model/blacklistTokenModel");
const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");
const { env } = require("../../environment");
const logger = require("../../logger");

const addBlacklistToken = async (ctx) => {
  try {
    const theToken = ctx.request.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(
      theToken,
      JSON.stringify(SHA256(env.ADMIN_TOKEN).words)
    );
    const data = await createBlacklistToken(decoded, theToken);
    if (data.error) throw data.error;
    ctx.body = {
      response: "success",
      data: data,
    };
  } catch (error) {
    logger.error({
      error,
      inputs: ctx.request.headers.authorization.split(" ")[1],
    });
    ctx.status = 500;
    ctx.body = {
      response: "failure",
      error: error,
    };
  }
};

module.exports = {
  addBlacklistToken,
};
