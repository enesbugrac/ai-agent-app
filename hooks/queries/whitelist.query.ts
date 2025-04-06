

export const useWhitelistQuery = () => {


    const addEmailToWhitelist = async (email: string) => {
        const data = await fetch('/whitelist', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });

        return data.json() as Promise<{ message: string, status: "exists" | "added" | "error" }>;
    };

    return { addEmailToWhitelist };
};
