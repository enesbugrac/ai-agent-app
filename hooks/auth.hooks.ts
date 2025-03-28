import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthStore } from '@/store/useStore';
import { useThreadsStore } from '@/store/useThreadsStore';
import { User, UserProfile } from '@/types/user.types';
import { useRouter } from 'next/navigation';
import { usePrivateFetch } from './fetch.hooks';



export function useAuth() {
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
        if (user !== null || isFetching) return;

        // Fetch User Profile
        setIsFetching(true);
        privateFetch('/user/auth')
            .then(async (res) => {
                if (!res.ok) {
                    console.error('Failed to fetch user:', res.statusText);
                    return null; // explicitly return null to avoid loops
                }

                const profile: UserProfile = await res.json();
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

    const isLoading = !ready || isFetching;

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