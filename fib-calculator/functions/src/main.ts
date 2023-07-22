import * as Fib from "fib-retracement";
import {RedisClientType} from "redis";

/**
 *
 * @param {string} asset
 * @param {string} time
 * @param {RedisClient} publisher
 * @return {any} fib
 */
async function fibs(asset: string, time: string,
    publisher: RedisClientType): Promise<any> {
  const Publisher = publisher.duplicate();
  await Publisher.connect();
  const exchange = asset.includes("/") || asset.includes("-") ?
    "bitfinex":"alpaca";
  const candles = ((await Publisher
      .zRange(
          `candles:${exchange}:${asset.replace("/", ":")}:${time}`, 0, -1
      )) as any).map((c: string)=>(JSON.parse(c)));
  if (candles.length > 0) {
    const high = candles.reduce((a, o) =>
      (a ? Math.max(a.value, o[2]) == a.value ? a :
         {value: o[2], time: o[0]} : {value: o[2], time: o[0]}), 0);
    const low = candles.reduce((a, o) =>
      (a ? Math.min(a.value, o[3]) == a.value ? a :
         {value: o[3], time: o[0]} : {value: o[3], time: o[0]}), 0);
    const message : {a: string, m:string, f:string, p:string | null} =
            {m: `${high.time > low.time ? "Retracement (Uptrend, Buy Targets)" :
            "Extension (Downtrend, Sell Targets)"}`, f: "", p: "",
            a: asset.replace("/", ":")};
    const levels = {0: low.value, 1: high.value};
    if (levels[0]) {
      const fib = Fib.getFibRetracement({levels});
      message.f= fib;
    } else {
      message.f = "Data Error";
    }
    message.p = candles[candles.length - 1][4];
    Publisher.disconnect();
    return (message);
  } else {
    Publisher.publish("Price Server", JSON
        .stringify(["ST", exchange, asset]));
    Publisher.publish("Price Server", JSON
        .stringify(["SC", exchange, asset, time]));
    const result = () => {
      return new Promise((resolve, reject) => {
        setTimeout(async ()=> resolve(await fibs(asset, time, Publisher)),
            5000);
      });
    };
    return await result();
  }
}
// console.log(await fibs('AAPL', '15m')) //!TEMP

export default fibs;
