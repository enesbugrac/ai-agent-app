import { api } from "@/utils/fetch.utils";

export const useWhitelistQuery = () => {
  
    const addEmailToWhitelist = async (email: string) => {
        const data = await api.fetch<{ message: string, status: "exists" | "added" | "error" }>('/whitelist', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });

        return data;
    };

    return { addEmailToWhitelist };
};
