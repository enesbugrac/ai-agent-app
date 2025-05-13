import { FaBrain, FaCogs, FaUsers, FaChartLine } from "react-icons/fa";

const FeaturesSection = () => {
  const cards = [
    {
      title: "Solve Problems",
      icon: <FaBrain className="text-[#FFDB48] text-3xl" />,
      desc: "Use AI agents to analyze, prioritize and offer solutions for real-world challenges. From bug fixes to business strategies — we've got it covered.",
    },
    {
      title: "Automate Tasks",
      icon: <FaCogs className="text-[#FFDB48] text-3xl" />,
      desc: "Let your agents handle repetitive actions — scheduling, messaging, organizing data, and more. Focus on what matters while they do the rest.",
    },
    {
      title: "Collaborate Intelligently",
      icon: <FaUsers className="text-[#FFDB48] text-3xl" />,
      desc: "Assign, share, and delegate tasks between agents and teammates. Create workflows where human and AI work as one.",
    },
    {
      title: "Learn From Data",
      icon: <FaChartLine className="text-[#FFDB48] text-3xl" />,
      desc: "Empower your agents to extract insights from raw data — visualize trends, detect anomalies, and deliver data-driven recommendations tailored to your needs.",
    },
  ];

  return (
    <section className="w-full h-[100vh] flex flex-col items-center justify-center gap-10 relative gradient-background mt-[6rem]">
      <div className="w-full max-w-7xl flex flex-col  gap-16">
        <h2 className="text-4xl md:text-9xl font-bold text-white font-syne line-clamp-1">
          Use Agents To
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {cards.map((item, i) => (
            <div
              key={i}
              className="bg-[#1A1D24] p-6 rounded-xl text-left flex flex-col gap-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div>{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
