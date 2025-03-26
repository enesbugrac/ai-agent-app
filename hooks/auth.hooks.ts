import { useEffect, useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthStore } from '@/store/useStore';
import { useThreadsStore } from '@/store/useThreadsStore';
import { User, UserProfile } from '@/types/user.types';
import { useRouter } from 'next/navigation';

interface UseAuthReturn {
    isLoading: boolean;
    user: User | null;
    logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const {
        ready,
        authenticated,
        user: privyUser,
        logout: privyLogout
    } = usePrivy();
    const { user, setUser } = useAuthStore();
    const { updateThreadsWithoutMessages, clearThreads } = useThreadsStore();
    const router = useRouter();

    const [isFetchingApi, setIsFetchingApi] = useState(false);

    const fetchAndSetUser = useCallback(async () => {
        if (isFetchingApi || user || !privyUser) return; // Added privyUser check

        setIsFetchingApi(true);
        try {
            const response = await fetch('/api/auth');
            if (!response.ok) {
                setUser(null);
                clearThreads();
                throw new Error(`API fetch failed: ${response.statusText}`);
            }

            const userProfile: UserProfile = await response.json();

            if (!userProfile) { // Removed !privyUser check here, handled above
                throw new Error('User profile data not found in API response');
            }

            const combinedUser: User = {
                ...userProfile,
                privyData: privyUser // Warning: Potential serialization/staleness issues persist
            };

            setUser(combinedUser);

            if (userProfile.threads) {
                updateThreadsWithoutMessages(userProfile.threads);
            } else {
                clearThreads(); // Warning: This might unintentionally clear existing threads
            }

        } catch (error) {
            console.error('Error during fetchAndSetUser:', error);
            if (user !== null) {
                setUser(null);
                clearThreads();
            }
        } finally {
            setIsFetchingApi(false);
        }

    }, [user, isFetchingApi, setUser, clearThreads, updateThreadsWithoutMessages, privyUser]);


    useEffect(() => {
        if (!ready) {
            return;
        }

        if (authenticated && privyUser) {
            if (!user && !isFetchingApi) { // Added !isFetchingApi check
                fetchAndSetUser();
            }
        } else {
            if (user !== null) {
                setUser(null);
                clearThreads();
            }
            if (isFetchingApi) {
                setIsFetchingApi(false);
            }
        }
    }, [
        ready,
        authenticated,
        privyUser,
        user,
        isFetchingApi, // Added isFetchingApi
        fetchAndSetUser,
        setUser,
        clearThreads
    ]);

    const logout = useCallback(async () => {
        try {
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

    const isLoading = !ready || isFetchingApi;

    return { isLoading, user, logout };
}