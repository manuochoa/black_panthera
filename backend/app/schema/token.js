const mongoose = require("mongoose");

let tokenSchema = mongoose.Schema(
  {
    network: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      length: 300,
    },
    address: {
      type: String,
      required: true,
      lowercase: true
    },
    decimals: {
      type: String,
      required: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
    },
    logoURI: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tokens = mongoose.model(
  `blackPantherTokens`,
  tokenSchema
);

module.exports = { Tokens };
