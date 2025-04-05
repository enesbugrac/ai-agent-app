import React from "react";
import { useInView } from "react-intersection-observer";
import "animate.css";

const Pricing = () => {
  const { ref: pricingTitleRef, inView: pricingTitleInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: pricingCardsRef, inView: pricingCardsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section
      id="pricing"
      className="w-full h-[100vh] flex flex-col items-center justify-center gap-10 relative"
    >
      <div className="w-full max-w-7xl flex flex-col gap-16">
        <h1
          ref={pricingTitleRef}
          className={`text-white text-9xl font-syne tracking-wide font-bold ${
            pricingTitleInView ? "animate__animated animate__fadeInLeft" : "opacity-0"
          }`}
        >
          Pricing
        </h1>

        <div ref={pricingCardsRef} className="w-full flex flex-wrap justify-between">
          <div
            id="free-credits"
            className={`group bg-primary rounded-xl p-6 w-[calc(25%-0.5rem)] min-h-[350px] flex flex-col justify-between font-syne cursor-pointer transition-opacity duration-500 ${
              pricingCardsInView ? "animate__animated animate__bounceInLeft" : "opacity-0"
            }`}
          >
            <span className="text-black/70 group-hover:text-black transition-colors duration-300 text-4xl font-medium">
              Free
            </span>

            <div className="flex flex-col justify-center gap-2">
              <h2 className="text-black group-hover:text-black transition-colors duration-300 text-[10rem]">
                15
              </h2>
              <p className="text-black/70 group-hover:text-black transition-colors duration-300 text-xl">
                Credits per month
              </p>
            </div>
          </div>

          <div
            id="fixed-price"
            className={`group gradient-background hover:bg-primary transition-all duration-300 rounded-xl p-6 w-[75%] min-h-[350px] flex flex-col justify-between relative overflow-hidden font-syne cursor-pointer ${
              pricingCardsInView
                ? "animate__animated animate__bounceInRight"
                : "opacity-0"
            }`}
          >
            <span className="text-white/70 group-hover:text-black transition-colors duration-300 text-4xl font-medium">
              Fixed price
            </span>

            <div className="flex flex-col justify-center gap-2">
              <h2 className="text-white group-hover:text-black transition-colors duration-300 text-[10rem]">
                $10 - 1000 cr
              </h2>
              <p className="text-white/70 group-hover:text-black transition-colors duration-300 text-xl">
                buy as many credits as you need
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
