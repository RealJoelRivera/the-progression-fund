import * as functions from "firebase-functions";

import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import Alpaca from "@alpacahq/alpaca-trade-api";
import CCXT from "ccxt";

initializeApp({credential: applicationDefault()});
const db = getFirestore();

export const updateCryptoData = functions.pubsub.schedule("*/5 * * * *")
  .timeZone("America/New_York").onRun( async (context) => {
    const Kucoin = new CCXT.kucoin({
      apiKey: functions.config().kucoin.key,
      secret: functions.config().kucoin.secret,
      password: functions.config().kucoin.password,
    });
    const Phemex = new CCXT.phemex({
      apiKey: functions.config().phemex.key,
      secret: functions.config().phemex.secret,
    });

    const Kbalances = await Kucoin.fetchBalance({type: "funding"});
    const Ktotal = (Kbalances as any).total;
    let KtotalUSD = 0;

    for (const key in Ktotal) {
      if (Ktotal[key] !== 0) {
        if (key != "USD" && key != "USDC" && key != "USDT") {
          const ticker = await Kucoin.fetchTicker(key+"/USDT");
          const usdvalue = (ticker.last || 0)*Ktotal[key];
          KtotalUSD += usdvalue;
        } else {
          KtotalUSD += Ktotal[key];
        }
      }
    }
    db.doc("progressionfund/kucoin").set({
      total: KtotalUSD,
    });

    const Pbalances = await Phemex.fetchBalance({type: "swap", code: "USDT"});
    const Ptotal = (Pbalances as any).total;
    let PtotalUSD = 0;

    for (const key in Ptotal) {
      if (Ptotal[key] !== 0) {
        if (key != "USD" && key != "USDC" && key != "USDT") {
          const ticker = await Phemex.fetchTicker(key+"/USD");
          const usdvalue = (ticker.last || 0)*Ptotal[key];
          PtotalUSD += usdvalue;
        } else {
          PtotalUSD += Ptotal[key];
        }
      }
    }

    const Ppositions = Pbalances["info"]["data"]["positions"];
    Ppositions.forEach( (p: any) => {
      if (p.size != 0) {
        const PnL = p["posCostRv"]-p["usedBalanceRv"]+
          +p["curTermRealisedPnlRv"];
        PtotalUSD += PnL;
      }
    });

    db.doc("progressionfund/phemex").set({
      total: PtotalUSD,
    });


    /* const Ppositions = await Phemex.fetchPositions();
    Ppositions.forEach( (p: any) => {
      functions.logger.log("Phemex Position: ", p);
    });*/
    // functions.logger.log("Phemex Balances: ", Pbalances);
    // functions.logger.log("Phemex Positions: ", Ppositions);
  });

export const updateAlpacaData = functions.pubsub.schedule("*/5 * * * *")
  .timeZone("America/New_York").onRun( async (context) => {
    const alpaca = new Alpaca({
      keyId: functions.config().alpaca.key,
      secretKey: functions.config().alpaca.secret,
    });
    const account = await alpaca.getAccount();
    const positions = await alpaca.getPositions();
    const pos: any = [];
    positions.forEach( (p: any) => pos.push({
      quantity: p.qty,
      symbol: p.symbol,
      average: (p.avg_entry_price*1).toFixed(2),
      PL: (p.unrealized_plpc*100).toFixed(2),
      value: p.market_value,
    }));
    /*
    const orders = await alpaca.getOrders();

    db.doc("progressionfund/orders").set(
      orders.map((o:any) => ({
        symbol: o.symbol,
        quantity: o.qty,
        limit_price: o.limit_price,
        total: o.qty*o.limit_price,
      }))
    );*/

    db.doc("progressionfund/alpaca").set({
      equity: account.equity,
      cash: account.cash,
      buying_power: account.buying_power,
      portfolio_value: account.portfolio_value,
      long_market_value: account.long_market_value,
      non_marginable_buying_power: account.non_marginable_buying_power,
      positions: pos,
    });
  });
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
