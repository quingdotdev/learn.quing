import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { type ReactNode, useCallback, useMemo } from "react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function ConvexRootProvider({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}>
      <ConvexBridge client={convex}>
        {children}
      </ConvexBridge>
    </AuthKitProvider>
  );
}

function ConvexBridge({ client, children }: { client: ConvexReactClient, children: ReactNode }) {
    const { user, isLoading, getAccessToken } = useAuth();

    const fetchAccessToken = useCallback(async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
        try {
            return await getAccessToken({ forceRefresh: forceRefreshToken });
        } catch (e) {
            console.error("Failed to get WorkOS access token", e);
            return null;
        }
    }, [getAccessToken]);

    const authState = useMemo(() => ({
        isLoading,
        isAuthenticated: !!user,
        fetchAccessToken,
    }), [isLoading, user, fetchAccessToken]);

    return (
        <ConvexProviderWithAuth client={client} useAuth={() => authState}>
            {children}
        </ConvexProviderWithAuth>
    );
}
