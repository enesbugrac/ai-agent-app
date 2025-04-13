"use client";

import Page from "@/components/page/Page";
import PageHeader from "@/components/page/PageHeader";
import PageBody from "@/components/page/PageBody";
import React, { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { MdOutlineDone } from "react-icons/md";
import { useTasksStore, TaskType } from "@/store/tasksStore";
import { FaTasks } from "react-icons/fa";

const TasksPage = () => {
  const [earned, setEarned] = useState<number>(0);
  const { tasks, completeTask } = useTasksStore();
  
  const handleTaskAction = (taskType: TaskType, id: string, points: number = 100) => {

    switch (taskType) {
      case TaskType.WALLET_CREATION:
        console.log("Creating wallet...");
        setTimeout(() => {
          const walletAddress = "0x" + Math.random().toString(16).substring(2, 42);
          completeTask(id, walletAddress);
          setEarned(prev => prev + points);
        }, 1500);
        break;
        
      case TaskType.CONNECT_X:
        console.log("Connecting X account...");
        window.open("https://x.com/oauth", "_blank");
        setTimeout(() => {
          const username = "@user_" + Math.floor(Math.random() * 10000);
          completeTask(id, username);
          setEarned(prev => prev + points);
        }, 1500);
        break;
        
      case TaskType.FOLLOW_X:
        console.log("Following @AIGEN_AI...");
        window.open("https://x.com/AIGEN_AI", "_blank");
        setTimeout(() => {
          const followDate = new Date().toLocaleDateString();
          completeTask(id, `Followed on ${followDate}`);
          setEarned(prev => prev + points);
        }, 1500);
        break;
        
      case TaskType.TWEET:
        console.log("Setting up tweet...");
        const tweetText = encodeURIComponent("I'm excited about @AIGEN_AI! #AIGEN #AI");
        window.open(`https://x.com/intent/tweet?text=${tweetText}`, "_blank");
        setTimeout(() => {
          const tweetId = "tweet_" + Math.floor(Math.random() * 1000000000);
          completeTask(id, `https://x.com/user/status/${tweetId}`);
          setEarned(prev => prev + points);
        }, 1500);
        break;
        
      default:
        console.warn("Unknown task type:", taskType);
    }
  };

  return (
    <Page>
      <PageHeader title="Tasks" icon={<FaTasks className="text-primary text-lg" />}/>
      <PageBody>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-center justify-between">
          <div>
          <h2 className="text-2xl font-medium text-white mb-2">
              Community Missions
            </h2>
            <p className="text-secondary">Complete missions to earn rewards</p>
          </div>
            <div className="flex items-center gap-2">
                <span className="text-secondary ">
                    Earned:
                </span>
                <span className="text-tertiary text-sm font-medium">
                    {earned} $AIGEN
                </span>
            </div>

          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border flex items-center justify-between border-border rounded-lg p-4 ${
                  task.completed ? "border-tertiary/40" : ""
                }`}
              >
                <div className="flex flex-col gap-2 w-[50%]">
                  <h1>{task.title}</h1>
                  <p className="text-secondary/50 text-sm truncate">
                    {task.value || task.description}
                  </p>
                </div>
                <p className="flex-1 text-center text-secondary/50 text-sm">
                  {task.points} $AIGEN
                </p>
                <div className="flex justify-end w-[30%]">
                  {!task.completed ? (
                    <PrimaryButton 
                      onClick={() => handleTaskAction(task.taskType, task.id, task.points)}
                      className="min-w-[100px]"
                    >
                      {task.button}
                    </PrimaryButton>
                  ) : (
                    <MdOutlineDone className="w-4 h-4 text-tertiary" />
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </PageBody>
    </Page>
  );
};

export default TasksPage;
