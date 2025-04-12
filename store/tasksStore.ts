import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define task types for different completion processes
export enum TaskType {
  WALLET_CREATION = "wallet_creation",
  CONNECT_X = "connect_x",
  FOLLOW_X = "follow_x",
  TWEET = "tweet"
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  value?: string;
  button?: string;
  points?: number;
  taskType: TaskType;
  completed: boolean;
  completedAt?: Date;
}

// Predefined static tasks
const staticTasks: Task[] = [
  {
    id: "1",
    title: "Create a Wallet",
    description: "Create a wallet to start earning",
    value: "",
    button: "Create",
    points: 100,
    taskType: TaskType.WALLET_CREATION,
    completed: false
  },
  {
    id: "2",
    title: "Connect Your X Account",
    description: "Connect your X account to earn",
    value: "",
    button: "Connect",
    points: 100,
    taskType: TaskType.CONNECT_X,
    completed: false
  },
  {
    id: "3",
    title: "Follow @AIGEN_AI on X",
    description: "Follow @AIGEN_AI on X to earn",
    value: "",
    button: "Follow",
    points: 100,
    taskType: TaskType.FOLLOW_X,
    completed: false
  },
  {
    id: "4",
    title: "Tweet about AIGEN_AI",
    description: "Tweet about AIGEN_AI to earn",
    value: "",
    button: "Tweet",
    points: 100,
    taskType: TaskType.TWEET,
    completed: false
  }
];

interface TasksState {
  tasks: Task[];
  completeTask: (id: string, returnedValue?: string) => void;
  resetTask: (id: string) => void;
  getTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  getTaskByType: (type: TaskType) => Task | undefined;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: staticTasks,
      
      completeTask: (id, returnedValue) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { 
                  ...task, 
                  completed: true, 
                  completedAt: new Date(),
                  ...(returnedValue ? { value: returnedValue } : {})
                }
              : task
          ),
        }));
      },
      
      resetTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: false, completedAt: undefined, value: "" }
              : task
          ),
        }));
      },
      
      getTasks: () => get().tasks,
      
      getCompletedTasks: () => get().tasks.filter((task) => task.completed),
      
      getPendingTasks: () => get().tasks.filter((task) => !task.completed),
      
      getTaskByType: (type) => get().tasks.find((task) => task.taskType === type),
    }),
    {
      name: "tasks-storage",
    }
  )
); 