const { addToken, findTokensByNetwork,findTokens, deleteToken } = require("../model/token");
const { cmcApi } = require("../utils/externalApiCall");
const logger = require('../../logger')



const saveToken = async (ctx) => {
    try {
        const body = ctx.request.body
        console.log("body", body)
        const saved = await addToken(body)

        if (saved?.error) throw saved.error
        ctx.body = {
            response: "success",
            data: saved
        }
    } catch (error) {
        console.log(error, "errorrr")
        logger.error({
            error
        });
        ctx.status = 500;
        ctx.body = {
            response: "failure",
            error: error,
        };
    }
};


const tokenInfo = async (ctx) => {
    try {
        logger.info({ inputs: ctx.request.query });
        const tokenAddress = ctx.request.query.tokenAddress
        const url = `/v1/cryptocurrency/info?address=${tokenAddress}`

        const tokenInfo = await cmcApi(url)
        const id = !tokenInfo.error ? Object.keys(tokenInfo.data)[0] : null

        ctx.body = {
            response: "success",
            data: id ? tokenInfo.data[id].logo : ''
        }

    }
    catch (error) {
        logger.error({ error });
        ctx.body = {
            response: "failure",
            error: error
        }
    }
}

const getAllToken = async (ctx) => {
    try {
        const result = await findTokens()
        if(result?.error) throw result.error
        ctx.body = {
            response: "success",
            data: result
        }

    } catch (error) {
        logger.error({
            error
        });
        ctx.status = 500;
        ctx.body = {
            response: "failure",
            error: error,
        };
    }
};


const getNetworkTokens = async (ctx) => {
    try {
        const { network } = ctx.request.params

        const result = await findTokensByNetwork(network)

        ctx.body = {
            response: "success",
            data: result
        }

    } catch (error) {
        logger.error({
            error
        });
        ctx.status = 500;
        ctx.body = {
            response: "failure",
            error: error,
        };
    }
};


const removeToken = async (ctx) => {
    try {
        const { id } = ctx.request.params
        console.log(id, "iddd")
        const deleted = await deleteToken(id)

        ctx.body = {
            response: "success",
            data: deleted
        }

    } catch (error) {
        logger.error({
            error
        });
        ctx.status = 500;
        ctx.body = {
            response: "failure",
            error: error,
        };
    }
};


module.exports = {
    removeToken,
    saveToken,
    tokenInfo,
    getNetworkTokens,
    getAllToken
}