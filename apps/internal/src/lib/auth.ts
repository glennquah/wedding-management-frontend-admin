import { AuthService } from '@wedding/api-types';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const response = await AuthService.authControllerRefreshToken();

    return {
      ...token,
      backendTokens: response.backendTokens,
    };
  } catch {
    // If refresh fails, return the original token to trigger re-login
    return token;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;

        try {
          const user = await AuthService.authControllerLogin({
            username,
            password,
          });
          return user;
        } catch (error: unknown) {
          if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
            console.log('Unauthorized login attempt');
            return null;
          }
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (new Date().getTime() < token.backendTokens.expiresIn) return token;

      return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },

  pages: {
    signIn: '/',
  },
};
