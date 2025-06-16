"use client";

import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { MdOutlineDone } from "react-icons/md";

import { useTasksQuery } from "@/hooks/queries/tasks.query";
import { useAuthStore } from "@/store/useStore";
import { usePrivy, User } from "@privy-io/react-auth";
import { useModalStore } from "@/store/modalStore";
import WhitelistForm from "@/components/whitelist/WhitelistForm";

const TasksPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getTasks, completeTask } = useTasksQuery();
  const { user } = useAuthStore();
  const { user: privyUser } = usePrivy();
  const { openModal } = useModalStore();
  // Fetch tasks on component mount

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await getTasks();
        console.log("response", response);
        setTasks(response.tasks);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTaskAction = (type: any, id: string) => {
    switch (type) {
      case "FOLLOW":
        console.log("Following @AIGEN...");
        window.open("https://x.com/aigenlabai", "_blank");
        completeTask((privyUser as User).id, id);
        break;

      case "LIKE":
        console.log("Liking tweet...");
        window.open("https://x.com/aigenlabai/status/1932525703838228528", "_blank");
        completeTask((privyUser as User).id!, id);
        break;

      default:
        console.warn("Unknown task type:", type);
    }
  };

  useEffect(() => {
    if (tasks.every((task) => task.completed)) {
      openModal(<WhitelistForm />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <p className="text-secondary">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 py-6">
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-white mb-2">Community Missions</h2>
          <p className="text-secondary">Complete missions to earn rewards</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-secondary text-xs md:text-sm">Earned:</span>
          <span className="text-tertiary text-xs md:text-sm font-medium">0 $AIGEN</span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="w-full text-center p-10 border border-border rounded-lg">
          <p className="text-secondary">No tasks available at this time.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`border flex items-center justify-between border-border rounded-lg p-4 ${
                task.completed ? "border-tertiary/40" : ""
              }`}
            >
              <div className="flex flex-col gap-2 w-[50%]">
                <h1>{task.title}</h1>
                <p className="text-secondary/50 text-xs md:text-sm truncate">
                  {task.value || task.description}
                </p>
              </div>
              <div className="flex justify-end w-[20%] md:w-[30%]">
                {!task.completed ? (
                  <PrimaryButton
                    onClick={() => handleTaskAction(task.type, task._id)}
                    className="md:min-w-[100px] text-xs md:text-sm"
                  >
                    {user?.tasks.find((t) => t.taskId === task._id)?.status ===
                      "completed" && "Completed"}
                    {user?.tasks.find((t) => t.taskId === task._id)?.status ===
                      "pending" && "Pending"}
                    {!user?.tasks.find((t) => t.taskId === task._id) && "Complete"}
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
  );
};

export default TasksPage;
