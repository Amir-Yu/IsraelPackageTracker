const request = require("request-promise");

module.exports = async itemID => {
  const config = {
    host: "www.logistics.dhl",
    URL: `https://www.logistics.dhl/utapi?trackingNumber=${itemID}&language=en&requesterCountryCode=DE`,
    userAgent: process.env.USERAGENT
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
