const mongoose = require("mongoose");
const { env } = require("../../environment");
const logger = require("../../logger");

let connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      env.MONGOOSE_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      { useCreateIndex: true }
    );
    logger.info(`Mongoose Connected ${conn.connection.host}`);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
