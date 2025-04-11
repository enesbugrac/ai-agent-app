import React from 'react';
import Image from 'next/image';
import { AgentData } from '@/data/agents';


const AgentDescription: React.FC<AgentData> = ({
  logo,
  name,
  subTitle,
  description,
  actions,
}) => {
  return (
    <div className=" text-white rounded-lg max-w-sm w-80 text-left">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3 w-full">
        <div className="rounded bg-background flex items-center justify-center border border-gray-600 p-0.5">
          <Image
            src={logo || ""}
            alt={`${name} logo`}
            width={36}
            height={36}
            className="rounded-md"
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-100">{name}</h2>
          <p className="text-xs text-gray-400">{subTitle}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 w-full">
        <h3 className="text-sm font-medium text-gray-200 mb-1">Description</h3>
        <p className="text-xs text-gray-400 leading-relaxed w-full text-wrap">{description}</p>
      </div>

      <hr className="border-gray-700 my-3 w-full" />

      {/* Actions */}
      <div className="w-full">
        <h3 className="text-sm font-medium text-gray-200 mb-1">Actions</h3>
        <p className="text-xs text-gray-500 mb-3">What {name} can do</p>
        <div className="space-y-3 w-full flex-1 overflow-y-auto">
          {actions?.map((action, index) => (
            <div key={index} className="w-full">
              <h4 className="text-xs font-medium text-gray-300">{action.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5 text-wrap">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDescription; 