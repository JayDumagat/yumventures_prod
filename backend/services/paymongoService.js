const axios = require("axios");
const base64 = require("base-64");
require("dotenv").config();

const PK = process.env.PAYMONGO_SECRET_KEY;
const FE = process.env.FRONTEND_URL;

async function createCheckoutSession(line_items, metadata) {
  const formattedLineItems = line_items.map(item => ({
    name: item.name,
    amount: Number(item.amount),     // explicitly convert to number
    currency: "PHP",
    quantity: Number(item.quantity)
  }));

  console.log(JSON.stringify({
    data: {
      attributes: {
        payment_method_types: ["card", "gcash", "paymaya"],
        line_items: formattedLineItems,
        metadata,
        // FIXED: The correct placeholder format is {CHECKOUT_SESSION_ID} not {{CHECKOUT_SESSION_ID}}
        success_url: `${FE}/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FE}/payment-failed`
      }
    }
  }, null, 2));

  const resp = await axios.post(
    "https://api.paymongo.com/v1/checkout_sessions",
    {
      data: {
        attributes: {
          payment_method_types: ["card", "gcash", "paymaya"],
          line_items: formattedLineItems,
          metadata,
          // FIXED: The correct placeholder format is {CHECKOUT_SESSION_ID} not {{CHECKOUT_SESSION_ID}}
          success_url: `${FE}/cart`,
          cancel_url: `${FE}/payment-failed`
        }
      }
    },
    {
      headers: {
        Authorization: "Basic " + base64.encode(PK + ":"),
        "Content-Type": "application/json"
      }
    }
  );
  return resp.data.data.attributes.checkout_url;
}

module.exports = {
  createCheckoutSession
};