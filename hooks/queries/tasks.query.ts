import { useAuthStore } from "@/store/useStore";
import { usePrivateFetch, usePublicFetch } from "../fetch.hooks";

export const useTasksQuery = () => {
  const { publicFetch } = usePublicFetch();
  const { privateFetch } = usePrivateFetch();
  const { setUser } = useAuthStore();

  const getTasks = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await publicFetch<{ tasks: any[] }>("/tasks");

    return data;
  };

  const completeTask = async (userId: string, taskId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await privateFetch<any>(`/user/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ taskId }),
    });

    setUser(data);
    return data;
  };

  return { getTasks, completeTask };
};
