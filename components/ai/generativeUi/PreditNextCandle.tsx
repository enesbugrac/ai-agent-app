import {
  AreaSeries,
  createChart,
  ColorType,
  CandlestickSeries,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { PreditNextCandleMetadata } from "@/types/tools.types";

interface PreditNextCandleProps {
  toolData: PreditNextCandleMetadata;
}

const getIntervalMilliseconds = (interval: string): number => {
  const intervalMap: { [key: string]: number } = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1D': 24 * 60 * 60 * 1000,
    '1W': 7 * 24 * 60 * 60 * 1000,
  };
  return intervalMap[interval] || 24 * 60 * 60 * 1000; // default to 1 day
};


const PreditNextCandle: React.FC<PreditNextCandleProps> = ({ toolData }) => {

  console.log("toolData", toolData);
  const { prediction } = toolData;
  const { candles, interval, prediction: { confidence, open, high, low, close } } = prediction;
  const volume = candles.map((candle) => ({
    time: candle.time  as Time, // ✅ pure number, not wrapped in { timestamp }
    value: candle.volume,
  }));
  
  const actualCandles = candles.map(({ time, open, high, low, close }) => ({
    time: new Date(time).toISOString().split(".")[0], // ✅ pure number, not wrapped in { timestamp }
    open,
    high,
    low,
    close,
  }));
  


  console.log('prediction',prediction)
  
  const lastTimestamp = candles[candles.length - 1].time ;
  const predictedTime = (lastTimestamp + getIntervalMilliseconds(interval) / 1000);

  const predictedCandles = [
    {
      time: new Date(predictedTime).toISOString().split(".")[0],
      open,
      high,
      low,
      close,
    },
  ];
  

  const colors = {
    backgroundColor: "#1B1D22",
    lineColor: "rgba(136, 136, 136, 0.2)", 
    textColor: "white",
    areaTopColor: "#2962FF",
    areaBottomColor: "rgba(255, 219, 72, 0.2)",
    gridColor: "rgba(136, 136, 136, 0.2)",
  };

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: 800 });
    };

    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: {
          color: colors.gridColor,
        },
        horzLines: {
          color: colors.gridColor,
        },
      },
      width: 800,
      height: 400,
      rightPriceScale: {
        visible: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: colors.lineColor,
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
    });
    // newSeries.setData(volume);

    const actualSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderVisible: false,
      priceLineVisible: true, // show the last‐price line
      lastValueVisible: true, // show the last‐value label
    });
    actualSeries.setData(actualCandles);

    // 3. Add your predicted series (no last‐value label so it won't override)
    const predictedSeries = chart.addSeries(CandlestickSeries, {
      upColor: "rgba(255, 219, 72, 0.2)",
      downColor: "rgba(255, 219, 72, 0.2)",
      borderColor: "rgba(255, 219, 72, 1)",
      wickUpColor: "rgba(255, 219, 72, 1)",
      wickDownColor: "rgba(255, 219, 72, 1)",
      borderVisible: true,
      priceLineVisible: true, // hide the price‐line for this series
      lastValueVisible: true, // and hide its last‐value label
    });

    predictedSeries.setData(predictedCandles);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    // volume,
    // colors,
  ]);

  return (
    <div className="w-full  bg-[#1A1D23] backdrop-blur-sm p-4 rounded-lg">

        <div className="flex items-start justify-between mb-2 gap-2 ">
          <div className="flex flex-col gap-1">
            <h4 className="text-white font-medium text-md">{prediction.symbol}</h4>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400 border border-border px-2 py-1 rounded-md">Predicted Price: {prediction.prediction.close}</p>
              <p className="text-xs text-gray-400 border border-border px-2 py-1 rounded-md">Interval: {interval}</p>
              <p className="text-xs text-gray-400 border border-border px-2 py-1 rounded-md">Confidence: {prediction.prediction.confidence}%</p>
            </div>
          </div>
        </div>

     <div className="w-full h-full pt-4">
     <div ref={chartContainerRef} className="w-full h-full rounded-lg border border-border " />
     </div>

    </div>
  );
};

export default PreditNextCandle;
