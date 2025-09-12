import { UserResponseDto } from "@shared/api";
import "next-auth";

declare module 'next-auth' {
  interface Session {
    user: UserResponseDto

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserResponseDto

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}