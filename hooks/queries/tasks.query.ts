import { useAuthStore } from "@/store/useStore";
import { usePrivateFetch, usePublicFetch } from "../fetch.hooks";
import { useEffect, useMemo, useState } from "react";
import { Agent } from "@/data/agents";
import { useUser } from "@privy-io/react-auth";
import { useAuthCache } from "../auth.hooks";

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




export const useAgentsUsed = ()=>{
  const { privateFetch } = usePrivateFetch();
  const [agentsUsed, setAgentsUsed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response =  await privateFetch<{agents:string[]}>(`/threads/agents-used`, {
          method: "GET"
        });
        console.log("response", response);
        setAgentsUsed(response.agents);
      } catch(e:unknown) {
         console.error(e)
      }finally{
        setIsLoading(false);
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    agentsUsed, isLoading
  }
}





export const useAgentTasks = ()=>{
  const {agentsUsed, isLoading} = useAgentsUsed()
  const {user} = useAuthCache()


  const agentTasks = useMemo(()=>{
   return  [
      {
        id:'Arbitra',
        title:"Use Arbitra",
        description:"Use Arbitra Agent to earn points",
        completed: agentsUsed.includes(Agent.ARBITRAGE_ASSISTANT),
        link:'/agent/arbitrage-assistant',
        point: 15,
      },
      // {
      //   id:'Juvex',
      //   title:"Use Juvex",
      //   description:"Use Juvex Agent to earn points",
      //   completed: agentsUsed.includes(Agent.JUPITER_SWAP_ASSISTANT),
      //   link:'/agent/jupiter-swap-assistant',
      //   point: 15,
      // },
      // {
      //   id:'Oden',
      //   title:"Use Oden",
      //   description:"Use Oden Agent to earn points",
      //   completed: agentsUsed.includes(Agent.ODO_SWAP_ASSISTANT),
      //   link:'/agent/odos-swap-assistant',
      //   point: 15,
      // },
      // {
      //   id:'Predix',
      //   title:"Use Predix",
      //   description:"Use Predix Agent to earn points",
      //   completed: agentsUsed.includes(Agent.CANDLE_PREDICTION_AGENT),
      //   link:'/agent/candle-prediction-assistant',
      //   point: 15,
      //   },
    ]
  },[agentsUsed]) 



  const totalAgentPoints = agentTasks.reduce((acc, t) => {
    // Eğer t.point tanımlıysa onu ekle,
    // değilse t.completed true ise 15 ekle, değilse 0 ekle
    const pts = t.point ?? (t.completed ? 15 : 0);
  
    return acc + pts;
  }, 0);

  

  return {
    agentsUsed, isLoading, agentTasks, totalAgentPoints
  }
}