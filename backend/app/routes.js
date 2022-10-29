const koaRouter = require("koa-router");
const { login, checkAuth } = require("./controller/admin");
const { addBlacklistToken } = require('./controller/blackListController')
const { saveToken, tokenInfo, removeToken, getNetworkTokens, getAllToken } = require("./controller/tokenController");
const { validateToken } = require("./validations/tokenValidate");

const router = new koaRouter()

router.get("/get-logo", tokenInfo);
router.post("/save-token", validateToken, saveToken);
router.delete("/remove-token/:id", validateToken, removeToken)
router.get("/network-token/:network", getNetworkTokens)
router.get("/get-tokens", validateToken, getAllToken)

router.post("/login", login)
router.get("/auth", validateToken, checkAuth);
router.post("/blacklist-token", validateToken, addBlacklistToken);

module.exports = { router };

