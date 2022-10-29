const axios = require("axios")
const { env } = require('../../environment')


const cmcApi = async (url) => {
    try {
      const client = await axios({
        baseURL: env.CMC_SERVER_URL,
        url,
        method: "GET",
        headers: { 'X-CMC_PRO_API_KEY': env.CMC_API_KEY },
      });
  
      return client.data
  
    }
    catch (error) {
      //    console.log(error.response, "errorrr")
      return {
        error: 'Error Converting Price'
      }
  
    }
  };
  

  module.exports={
    cmcApi
  }