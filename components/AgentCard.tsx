import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Image from "next/image";
import { Tooltip } from "antd";
import AgentDescription from "./AgentDescription"; // Renamed import
import { AgentData } from "@/data/agents";

export default function AgentCard({
  id,
  name,
  subTitle,
  description,
  logo,
  actions,
}: AgentData) {
  return (
    <Link href={`/agent/${id}`} className="block group h-[200px] relative ">
      <div className="z-40 bg-background p-4 rounded-lg border border-border shadow-lg backdrop-blur-sm h-full  transition-all duration-300">
        <div className="flex  gap-3 mb-4 border-b border-border   pb-4">
          <div className="rounded bg-background flex items-center justify-center  border border-border">
            <Image
              src={logo || ""}
              alt=""
              width={40}
              height={40}
              className="rounded-lg"
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
                <AgentDescription // Use renamed component
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
    </Link>
  );
}
