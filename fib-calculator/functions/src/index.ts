import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fibs from "./main";
import {createClient} from "redis";

admin.initializeApp();
const db = admin.firestore();

const Publisher = createClient({url: process.env.REDIS_URL});

export const fib = functions.https.onRequest(
    async (request, response) => {
      await Publisher.connect();
      const params = request.params[0].split("/");
      const asset = params[0];
      const timeframe = params[1];
      const lines = await fibs(asset.slice(-3) == "USD" ?
        asset.replace("-", "/") : asset, timeframe, Publisher as any);
      await Publisher.disconnect();
      response.send(lines);
    });

export const dailyTargets = functions.pubsub.schedule("0 8 */1 * *")
    .timeZone("America/New_York").onRun( async (context) => {
      for (const ticker of tickers) {
        functions.logger.log(ticker);
        await Publisher.connect();
        const lines = await fibs(ticker.slice(-3) == "USD" ?
          ticker.replace("-", "/") : ticker, "1d", Publisher as any);
        await Publisher.disconnect();
        db.doc(`targets/${lines.a}`).set(lines);
      }
    });

const tickers = [
  "C",
  "MSFT",
  "AAPL",
  "GOOGL",
  "QCOM",
  "NVDA",
  "MDB",
  "META",
  "LYFT",
  "UBER",
  "COIN",
  "SQ",
  "AMD",
  "SHOP",
  "VZ",
  "T",
  "O",
  "IIPR",
  "NRG",
  "UNH",
  "CVS",
  "PEP",
  "WBA",
  "NKE",
  "V",
  "LOW",
  "DIS",
  "TGT",
  "IBUY",
  "PYPL",
  "DKNG",
  "TSLA",
  "NFLX",
  "BABA",
  "UPS",
  "LIT",
  "SOL/USD",
  "ETH/USD",
  "MATIC/USD",
  "ATOM/USD",
  "LINK/USD",
  "BTC/USD",
];

/*************************Write me a function that only accepts a 3 dimensional array as a parameter. The function will iterate the first level of the matrix, and, for each looped value, increase a counter by 1 only if the first item is a timestamp that occurs between the hours of 5AM and 8AM UTC and the quotient of the difference between the third item and the second item and the second item is greater than 0.01. At the end of the loop, return the counter. */