export enum TaskType {
  FOLLOW = "FOLLOW",
  LIKE = "LIKE",
}

export interface TaskRequirements {
  accountToFollow?: string;
  tweetId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Task {
  title: string;
  description: string;
  points: number;
  type: TaskType;
  requirements: TaskRequirements;
}
