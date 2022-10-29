const mongoose = require("mongoose");
const { env } = require("../../environment");

let blacklistSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    iat: {
      type: String,
      required: true,
      length: 300,
    },
    exp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlacklistTokens = mongoose.model(
  `${env.PROJECT_NAME}BlacklistTokens`,
  blacklistSchema
);

module.exports = { BlacklistTokens };
