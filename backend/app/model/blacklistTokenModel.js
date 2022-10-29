const { BlacklistTokens } = require("../schema/blacklistToken");
const logger = require("../../logger");

const createBlacklistToken = async (obj, token) => {
  try {
    const data = await BlacklistTokens.create({
      user_id: obj.id,
      iat: obj.iat,
      exp: obj.exp,
      token: token,
    });

    if (!data) throw "not inserted";
    return data;
  } catch (error) {
    logger.error(error);
    return { error: error };
  }
};

const getToken = async (token) => {
  try {
    const result = await BlacklistTokens.find({
      $and: [{ token: token }],
    });

    return result;
  } catch (error) {
    logger.error(error);
    return { error: error };
  }
};

module.exports = {
  createBlacklistToken,
  getToken,
};
