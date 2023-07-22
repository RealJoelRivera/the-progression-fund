import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore } from 'firebase/firestore';
import { Chart } from "react-google-charts";


initializeApp({
    "apiKey": "AIzaSyAwnJDlbBfD2eKAL0w4ZjC0uXaN4zU1JsQ",
    "authDomain": "eliteentries-algo.firebaseapp.com",
    "projectId": "eliteentries-algo",
    "storageBucket": "eliteentries-algo.appspot.com",
    "messagingSenderId": "877958952735",
    "appId": "1:877958952735:web:07f14b5d5e1a115023222a",
    "measurementId": "G-E126LWT5N8"
});

const db = getFirestore();

export default function EquityDisplay() {
  const [data, loading, error] = useDocumentData(
    doc(db, 'progressionfund/alpaca')
  );
  const [kucoin, kloading, kerror] = useDocumentData(
    doc(db, 'progressionfund/kucoin')
  );
  const [phemex, ploading, perror] = useDocumentData(
    doc(db, 'progressionfund/phemex')
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  let d, k, p, total;
  if (data && kucoin && phemex) {
    d = data.equity;
    k = kucoin.total.toFixed(2);
    p = phemex.total.toFixed(2);
    total = Number(d) + Number(k) + Number(p);
  }

  let chartPos = []
  data && chartPos.push(['Cash', +data.cash],['Free Margin', +data.buying_power - +data.cash])
  
  data && data.positions.forEach((e) => { 
    chartPos.push([e.symbol, +e.value])
  })

  chartPos.sort( (a,b) => {
    return b[1] - a[1]
  })

  chartPos.unshift(['Symbol', 'Value'])

  const options = {
    backgroundColor: '#242424',
    legend: {
      textStyle: { 
        color: '#FFF'
      },
      position: 'top',
    },

  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column'}}>
      <h2>Total Equity: ${total.toLocaleString()}</h2>
      <h2>Stock Equity: ${data && Number(d).toLocaleString()}</h2>
      {chartPos.length > 0 && <>
        <Chart
          chartType="PieChart"
          data={chartPos}
          options={options}
          width="100%"
          height="400px"
        />
      </>}
      <h2>Kucoin Equity: ${kucoin && Number(k).toLocaleString()}</h2>
      <h2>Phemex Equity: ${phemex && Number(p).toLocaleString()}</h2>
    </div>
  );
};