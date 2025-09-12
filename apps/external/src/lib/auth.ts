import { AuthService, TokensDto, UserResponseDto, UserRole } from '@shared/api';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  backendTokens: TokensDto;
}

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
          const authResponse = await AuthService.authControllerLogin({
            username,
            password,
          });

          return {
            id: authResponse.user.id.toString(),
            name: authResponse.user.name,
            email: authResponse.user.email,
            role: authResponse.user.role as unknown as UserRole,
            createdAt: authResponse.user.createdAt,
            updatedAt: authResponse.user.updatedAt,
            backendTokens: authResponse.backendTokens,
          } as ExtendedUser;
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
      session.user.id = parseInt(token.id as string);
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as UserRole;
      session.user.createdAt = token.createdAt as string;
      session.user.updatedAt = token.updatedAt as string;
      session.backendTokens = token.backendTokens as TokensDto;

      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
};
