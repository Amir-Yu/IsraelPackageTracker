const request = require("request-promise");

module.exports = async itemID => {
  const config = {
    //host: "www.dhl.com/en/express/tracking.shtml?AWB=11111111&brand=DHL",
    host: "www.logistics.dhl",
    URL: `https://www.logistics.dhl/utapi?trackingNumber=${itemID}&language=en&requesterCountryCode=DE`,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0"
  };

  try {
    const initParamsOptions = {
      method: "GET",
      uri: config.URL,
      headers: {
        host: config.host,
        "User-Agent": config.userAgent,
        "Accept-Encoding": "gzip, deflate, br",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        Connection: "keep-alive"
      },
      gzip: true,
      //resolveWithFullResponse: true,
      transform: (body, response) => {
        return body;
      }
    };

    return await request(initParamsOptions);
  } catch (err) {
    throw err;
  }
};
