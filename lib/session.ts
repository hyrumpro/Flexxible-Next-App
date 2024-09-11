import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";
import { getUserByEmail, createUser } from "@/lib/actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    const existingUser = await getUserByEmail(user.email as string);

                    if (!existingUser) {
                        const newUser = await createUser({
                            name: user.name as string,
                            email: user.email as string,
                            avatarUrl: user.image as string,
                        });
                        user.id = newUser.id;
                    } else {
                        user.id = existingUser.id;
                    }
                    return true;
                } catch (error) {
                    console.error("Error checking/creating user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    userId: user.id,
                };
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.userId as string,
                },
                accessToken: token.accessToken as string,
                refreshToken: token.refreshToken as string,
            };
        },
    },
    events: {
        async signIn(message) {
            console.log("User signed in:", message);
        },
        async signOut(message) {
            console.log("User signed out:", message);
        },
    },
    debug: true,
};

export async function getCurrentUser(): Promise<SessionInterface | null> {
    const session = await getServerSession(authOptions) as SessionInterface;
    return session;
}
