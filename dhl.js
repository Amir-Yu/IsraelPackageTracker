const request = require("request-promise");
const cheerio = require("cheerio");

const config = {
  host: "www.dhl.com/en/express/tracking.shtml?AWB=11111111&brand=DHL",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0"
  //prePostURL: "/itemtrace",
  //postURL: "/umbraco/Surface/ItemTrace/GetItemTrace"
};

module.exports = async itemID => {
  try {
    const initParamsOptions = {
      uri: `https://${config.host}`,
      method: "GET",
      resolveWithFullResponse: true,
      transform: (body, response, resolveWithFullResponse) => {
        //const $ = cheerio.load(body);

        const cookie = response.headers["set-cookie"].map(x => x.split(";")[0]).join("; ");
        return { body, cookie };
      }
    };

    const initValues = await request(initParamsOptions);

    const jsonReqOptions = {
      uri: `https://${config.host}${config.postURL}`,
      method: "POST",
      gzip: true,
      //resolveWithFullResponse: true,
      headers: {
        Host: config.host,
        "User-Agent": config.userAgent,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",

        Origin: "https://mypost.israelpost.co.il",
        Referer: "https://mypost.israelpost.co.il/itemtrace",
        Cookie: initValues.cookie
      },
      form: {
        itemCode: itemID,
        lcid: initValues.lcid,
        __RequestVerificationToken: initValues.requestVerificationToken
      },
      transform: function(body) {
        return body;
      }
    };
    return await request(jsonReqOptions);
  } catch (err) {
    throw err;
  }
};
