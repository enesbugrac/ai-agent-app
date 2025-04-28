import { Thread } from "./thread.types";
import { User as PrivyUser } from "@privy-io/react-auth";


export type UserProfile = {
    _id: string;
    wallet: string;
    role: string;
    credits: number;
    threads: Thread[];
    tasks: any[];
}

export type User = UserProfile & {
    privyData: PrivyUser;
}