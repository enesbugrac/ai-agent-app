"use client";

import Page from "@/components/page/Page";
import PageHeader from "@/components/page/PageHeader";
import PageBody from "@/components/page/PageBody";
import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { MdOutlineDone } from "react-icons/md";

import { FaTasks } from "react-icons/fa";
import { useTasksQuery } from "@/hooks/queries/tasks.query";
import { useAuthStore } from "@/store/useStore";
import { usePrivy } from "@privy-io/react-auth";

const TasksPage = () => {
  const [earned, setEarned] = useState<number>(0); 

  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getTasks, completeTask } = useTasksQuery();
  const { user } = useAuthStore();
  const { user: privyUser} = usePrivy();
  
  // Fetch tasks on component mount

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await getTasks();
        console.log("response", response);
        setTasks(response.tasks);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        setIsLoading(false);  
      }
    };

    fetchTasks();
  }, []);
  
  
  const handleTaskAction = (type: any, id: string, points: number) => {

    switch (type) {
      case "FOLLOW":
        console.log("Following @AIGEN...");
        window.open("https://x.com/AIGEN_AI", "_blank");
        completeTask(privyUser?.id!, id);
        break;
        
      case "LIKE":
        console.log("Liking tweet...");
        window.open("https://x.com/AIGEN_AI/status/1234567890", "_blank"); 
        completeTask(privyUser?.id!, id);
        break;
        
      default:
        console.warn("Unknown task type:", type);
    }
  };

  if (isLoading) {
    return (
      <Page>
        <PageHeader title="Tasks" icon={<FaTasks className="text-primary text-lg" />}/>
        <PageBody>
          <div className="w-full flex justify-center items-center h-40">
            <p className="text-secondary">Loading tasks...</p>
          </div>
        </PageBody>
      </Page>
    );
  }


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
              <span className="text-secondary">
                Earned:
              </span>
              <span className="text-tertiary text-sm font-medium">
                {earned} $AIGEN
              </span>
            </div>
          </div>
          
          {tasks.length === 0 ? (
            <div className="w-full text-center p-10 border border-border rounded-lg">
              <p className="text-secondary">No tasks available at this time.</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
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
                        onClick={() => handleTaskAction(task.type, task._id, task.points)}
                        className="min-w-[100px]"
                      >
                        {user?.tasks.find((t) => t.taskId === task._id)?.status === "completed" && "Completed"}
                        {user?.tasks.find((t) => t.taskId === task._id)?.status === "pending" && "Pending"}
                        {!user?.tasks.find((t)=> t.taskId === task._id) && "Complete"}
                      </PrimaryButton>
                    ) : (
                      <MdOutlineDone className="w-4 h-4 text-tertiary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageBody>
    </Page>
  );
};

export default TasksPage;
