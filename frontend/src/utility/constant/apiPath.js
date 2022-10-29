import env from "../../environment";
export const APIPath = {
  server: env.BACKEND_BASE_URL,
 
  getLogo: "get-logo",
  saveToken : "save-token",
  networkToken: "network-token",
  removeToken: "remove-token",
  getTokens: "get-tokens",

  login: "login",
  logout: "blacklist-token",
  auth: "auth",
};
