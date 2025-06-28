import { usePrivateFetch, usePublicFetch } from "../fetch.hooks";

export const useWhitelistQuery = () => {
  const { publicFetch } = usePublicFetch();
  const { privateFetch } = usePrivateFetch();


  const addEmailToWhitelist = async (email: string, isPrivate:boolean=false) => {
   if(isPrivate){
    const data = await privateFetch<{
      message: string;
      status: "exists" | "added" | "error";
    }>("/user/whitelist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return data;
   }

    const data = await publicFetch<{
      message: string;
      status: "exists" | "added" | "error";
    }>("/whitelist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return data;
  };

  return { addEmailToWhitelist };
};
