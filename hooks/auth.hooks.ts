import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthStore } from '@/store/useStore';
import { useThreadsStore } from '@/store/useThreadsStore';
import { User, UserProfile } from '@/types/user.types';
import { useRouter } from 'next/navigation';
import { usePrivateFetch } from './fetch.hooks';


export function useAuthCache() {
    const { user } = useAuthStore();
    return {
        user
    }
}


// Use this hook to fetch user data from the database at the top level of the app
export function useAuthAsync() {
    const { ready, authenticated, user: privyUser } = usePrivy();
    const { user, setUser } = useAuthStore();
    const { updateThreadsWithoutMessages, clearThreads } = useThreadsStore();
    const { privateFetch } = usePrivateFetch();
    const [isFetching, setIsFetching] = useState(false);


    useEffect(() => {
        if (!ready) return;

        // If not authenticated, clear user data if previously set, and return
        if (!authenticated || !privyUser) {
            if (user !== null) {
                setUser(null);
                clearThreads();
            }
            return;
        }

        // If user already fetched, do not fetch again
        if (isFetching) return;

        // Fetch User Profile
        setIsFetching(true);
        privateFetch<UserProfile>('/user/auth')
            .then(async (profile: UserProfile) => {
                if (!profile) {
                    console.error('User profile not found');
                    return null;
                }

                const combinedUser: User = { ...profile, privyData: privyUser };
                setUser(combinedUser);

                if (profile.threads) {
                    updateThreadsWithoutMessages(profile.threads);
                } else {
                    clearThreads();
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            })
            .finally(() => {
                setIsFetching(false);
            });

    }, [
        ready,
        authenticated,
        privyUser,
        // intentionally exclude `user` and `isFetching` to avoid loop
        privateFetch,
        setUser,
        clearThreads,
        updateThreadsWithoutMessages,
    ]);


    // If user is not ready (privy is loading) or user is null and fetching from the database (Be is loading)
    // If there is a user in the cache, it will fetch the user from the database but not show loading animation
    // So it will be in the background fetching the user

    const isLoading = !ready || (!user && isFetching)

    return { isLoading, user, isAuthenticated: !!user };
}


export const useAuthMutations = () => {
    const { setUser } = useAuthStore();
    const { clearThreads } = useThreadsStore();
    const router = useRouter();
    const {
        logout: privyLogout
    } = usePrivy();

    const logout = useCallback(async () => {
        try {
            console.log('logging out');
            setUser(null);
            clearThreads();
            await privyLogout();
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            setUser(null);
            clearThreads();
            router.push('/?error=logout_failed');
        }
    }, [privyLogout, setUser, clearThreads, router]);

    return { logout };
}
