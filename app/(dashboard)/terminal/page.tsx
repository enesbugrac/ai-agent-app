"use client";

import { usePrivy } from "@privy-io/react-auth";
import { FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { agents } from "@/data/agents";
import AgentCard from "@/components/AgentCard";
import PreditNextCandle from "@/components/ai/generativeUi/PreditNextCandle";

export default function Home() {
  const { login, authenticated } = usePrivy();
  const featuredAgents = agents.slice(0, 3); // Show first 2 agents on home page

  const initialData = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    // { time: "2018-12-30", value: 22.68 },
    // { time: "2018-12-31", value: 22.67 },
  ];


  const fake = {
    isUi: true,
    metadata: {
      type: "candle-prediction",
      prediction: {
        symbol: "BTCUSDT",
        interval: "1h",
        candles: [
            {
        timestamp: "2018-12-22",
        open: 75.16,
        high: 82.84,
        low: 36.16,
        close: 45.72,
      volume: 32.51
      },
      { timestamp: "2018-12-23", open: 45.12, high: 53.9, low: 45.12, close: 48.09, volume: 31.11},
      {
        timestamp: "2018-12-24",
        open: 60.71,
        high: 60.71,
        low: 53.39,
        close: 59.29,
        volume: 27.02
      },  
      { timestamp: "2018-12-25", open: 68.26, high: 68.26, low: 59.04, close: 60.5, volume: 27.32},
      {
        timestamp: "2018-12-26",
        open: 67.71,
        high: 105.85,
        low: 66.67,
        close: 91.04,
        volume: 25.17
      },
      { timestamp: "2018-12-27", open: 91.04, high: 121.4, low: 82.7, close: 111.4, volume: 28.89 },
      {
        timestamp: "2018-12-28",
        open: 111.51,
        high: 142.83,
        low: 103.34,
        close: 131.25,
        volume: 25.46
      },
      {
        timestamp: "2018-12-29",
        open: 131.33,
        high: 151.17,
        low: 77.68,
        close: 104.43,
        volume:  23.92
      },
        ],
        prediction: {
          direction: "up",
          confidence: 0.72,
          open: 115.30,
          high: 160.50,
          low: 98.20,
          close: 155.43
        }
      }
    }
  }

  const volume = fake.metadata.prediction.candles.map((candle: { timestamp: string; volume: number; }) => ({
    time: candle.timestamp,
    value: candle.volume
  }));

  const actualCandles = fake.metadata.prediction.candles.map(({timestamp, open, high, low, close}) => ({
    time: timestamp,
    open,
    high,
    low,
    close
  }));

  const predicted = fake.metadata.prediction.prediction;

  const predictedCandles = [{
    time: "2018-12-30", //intervale gore
    open: predicted.open,
    high: predicted.high,
    low: predicted.low,
    close: predicted.close
  }];

  return (
    <>
      <div className="w-full h-full px-4 py-10">
        {/* <div className="shrink-0">
          {!authenticated && (
            <button
              onClick={login}
              className="bg-primary text-background px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Connect Wallet
            </button>
          )}
        </div> */}
        {/* <div className="">
          <div className="flex flex-col items-center gap-8 pt-12 lg:pt-28 w-full">
            <div className="text-6xl font-bold text-white text-center line-clamp-1">
              Welcome to <span className="text-tertiary font-markpro">AIGEN</span>
            </div>


              <div className="hidden sm:block text-center mt-4 text-secondary text-md space-y-1 opacity-80">
                <p>Aigen is learning how to delegate you to the right agent</p>
                <p>@ the right agent if you&apos;re led astray</p>
              </div>

          </div>

          <div className="hidden sm:flex items-center justify-between gap-4 flex-wrap mt-4">
            <div className="flex gap-3 flex-wrap">
              <button className="shrink-0 flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all text-xs font-medium text-black">
                <FaMapMarkerAlt className="text-sm" />
                Featured
              </button>
              <button className="shrink-0 flex items-center gap-2 text-secondary hover:text-primary px-3 py-1.5 rounded-lg hover:bg-background-highlight transition-all text-xs">
                <FaUserFriends className="text-sm" />
                My Agents
              </button>
            </div>
            <div className="text-xs text-primary/50">3 agents available</div>
          </div>

          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full">
            {featuredAgents.map((agent) => (
              <AgentCard
                key={agent.name}
                id={agent.id}
                name={agent.name}
                subTitle={agent.subTitle}
                description={agent.description}
                type={agent.type}
                logo={agent.logo}
                actions={agent.actions}
              />
            ))}
          </div>
        </div> */}
        {/* <PreditNextCandle volume={volume} actualCandles={actualCandles} predictedCandles={predictedCandles}></PreditNextCandle> */}
      </div>
    </>
  );
}
