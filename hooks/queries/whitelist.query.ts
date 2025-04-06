import { usePublicFetch } from "../fetch.hooks";

export const useWhitelistQuery = () => {
  const { publicFetch } = usePublicFetch();

  const addEmailToWhitelist = async (email: string) => {
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
