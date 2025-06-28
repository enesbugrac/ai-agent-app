import { Thread } from "./thread.types";
import { User as PrivyUser } from "@privy-io/react-auth";

export type UserProfile = {
  _id: string;
  wallet: string;
  role: string;
  credits: number;
  creditsUsage:number;
  threads: Thread[];
  tasks: UserTasks[];
  whitelistEmail:string|null
};

export type UserTasks = {
  _id: string;
  taskId: string;
  status: string;
  verifiedAt: Date;
  completedAt: Date;
  pointsEarned: number;
};

export type User = UserProfile & {
  privyData: PrivyUser;
};
