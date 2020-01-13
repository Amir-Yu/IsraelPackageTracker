const request = require("request-promise");
const cheerio = require("cheerio");
const htmltable2json = require("html-table-to-json");

module.exports = async ItemID => {
  try {
    const options = {
      uri: `https://www.aramex.com/track/results?ShipmentNumber=${ItemID}`,
      method: "GET",
      transform: async (body, response) => {
        const $ = cheerio.load(body);

        const shipment_address = $("div.address > div.shipment-address")
          .text()
          .split("\n")
          .filter(entry => entry.trim() != "")
          .map(item => item.trim());

        const type = $(".amx-cp-shipment-type-banner")
          .next()
          .children("dd.amx-h-font-medium")
          .text();
        const weight = $(
          ".amx-small-block-4-4.amx-medium-block-2-8.amx-large-block-2-12.amx-mr-block-style > div > dl > dd"
        ).text();
        const description = $(
          "div.amx-small-block-4-4.amx-medium-block-8-8.amx-large-block-5-12.amx-mr-block-style > div.amx-cp-data-list-wrapper > dl > dd"
        )
          .last()
          .text()
          .trim();

        const htmltableData = $(".amx-cp-responsive-table-static table");
        const jsonTables = new htmltable2json(htmltableData.parent().html());
        return await {
          shipment: {
            id: ItemID,
            address: {
              origin: shipment_address[0],
              originDate: shipment_address[1],
              destination: shipment_address[2],
              destinationDate: shipment_address[3]
            },
            type,
            weight,
            description,
            history: jsonTables.results[0]
          }
        };
      }
    };
    return await request(options);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
