import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Image from "next/image";
import { Tooltip } from "antd";
import AgentDescription from "./AgentDescription"; // Renamed import
import { AgentData } from "@/data/agents";

interface AgentCardProps extends AgentData {
  className?: string;
  clickable?: boolean;
}

export default function AgentCard({
  id,
  name,
  subTitle,
  description,
  logo,
  actions,
  className,
  clickable = true,
}: AgentCardProps) {
  const content = (
    <div className="z-40 bg-background p-4 rounded-lg border border-border shadow-lg backdrop-blur-sm h-full  transition-all duration-300">
        <div className="flex  gap-3 mb-4 border-b border-border   pb-4">
          <div className="w-10 h-10 rounded bg-background flex items-center justify-center  border border-border">
            <img
              src={logo || ""}
              alt=""
              className="rounded-lg w-full h-full object-cover"
            />
          </div>

          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col justify-start flex-1">
              <h3 className="text-primary text-sm font-medium">{name}</h3>
              <p className="text-secondary text-xs">{subTitle}</p>
            </div>

            <Tooltip
              placement="right"
              arrow={false}
              title={
                <AgentDescription 
                  logo={logo}
                  name={name}
                  subTitle={subTitle}
                  description={description}
                  actions={actions || []}
                  id={id}
                />
              }
              styles={{
                body: {
                  backgroundColor: "#1A1D23",
                  color: "white",
                  border: "1px solid #2D3137",
                },
                root: {
                  maxWidth: "none",
                },
              }}
            >
              <button className="rounded hover:bg-primary/5 text-secondary hover:text-tertiary pt-0.5 ">
                <AiOutlineQuestionCircle className="text-xl" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="text-secondary text-xs flex-1 overflow-hidden h-[4.5rem] line-clamp-3">
          {description}
        </div>
      </div>
  );

  return clickable ? (
    <Link href={`/agent/${id}`} className={`block group h-[200px] relative ${className} cursor-pointer`}>
      {content}
    </Link>
  ) : (
    <div className={`block group h-[200px] relative ${className} cursor-default`}>
      {content}
    </div>
  );
}
