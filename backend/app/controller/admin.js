const jwt = require("jsonwebtoken");
const SHA256 = require("crypto-js/sha256");
const { env } = require("../../environment");
const { generateHashPass } = require("../utils/common");
const logger = require("../../logger");

const login = async (ctx) => {
    try {
        const { username, password } = ctx.request.body;
        const hashedPassword = generateHashPass(password
        )
        if (username != env.ADMIN_USERNAME) {
            throw 'Invalid username'
        }
        else if (hashedPassword != env.PASSWORD) {
            throw 'Invalid Password'
        }
        else {
            const token = jwt.sign(
                { id: "01" },
                JSON.stringify(SHA256(env.ADMIN_TOKEN).words),
                { expiresIn: "1d" }
            );

            ctx.body = {
                response: "success",
                data: { token: token },
            };
        }

    } catch (error) {
        logger.error({ error, inputs: ctx.request.body });
        ctx.status = 500;
        ctx.body = {
            response: "failure",
            error: error,
        };
    }
};


const checkAuth = async (ctx) => {
    ctx.body = {
        response: "success",
        data: { auth: true },
    };
};

module.exports = {
    login,
    checkAuth,
};
