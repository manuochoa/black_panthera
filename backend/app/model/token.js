const logger = require("../../logger");
const { Tokens } = require("../schema/token");

const addToken = async (tokenInfo) => {
    try {
        const isAlready = await Tokens.findOne({ $and: [{ address: (tokenInfo.address).toLowerCase() }, { network: tokenInfo.network }] })
        if (isAlready) {
            throw 'Token already registered'
        }
        const result = await Tokens.create(tokenInfo)
        if (!result) throw 'Token info not saved'
        return result

    } catch (error) {
        logger.error(error);
        return { error };
    }
};

const findTokens = async () => {
    try {

        const result = await Tokens.find()

        if (!result) throw 'Error getting Token'

        return result

    } catch (error) {
        logger.error(error);
        return { error: error };
    }
};


const findTokensByNetwork = async (network) => {
    try {

        const result = await Tokens.find({ network })
        if (!result) throw 'Error deleting Token'
        return result

    } catch (error) {
        logger.error(error);
        return { error };
    }
};

const deleteToken = async (id) => {
    try {

        const result = await Tokens.deleteOne({ _id: id })
        if (!result) throw 'Error deleting Token'
        return result

    } catch (error) {
        logger.error(error);
        return { error };
    }
};

module.exports = {
    addToken,
    deleteToken,
    findTokensByNetwork,
    findTokens
};
