const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../shared/api');
const indexPath = path.join(configPath, 'index.ts');
const openApiPath = path.join(configPath, 'core/OpenAPI.ts');

if (fs.existsSync(indexPath)) {
  console.log('OpenAPI types generated successfully!');
  console.log('Types available in: shared/api/');

  const stats = fs.readdirSync(configPath);
  console.log('Generated files:', stats.join(', '));

  // Update the OpenAPI.ts configuration
  if (fs.existsSync(openApiPath)) {
    const customOpenAPIConfig = `/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
    BASE: string;
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string> | undefined;
    USERNAME?: string | Resolver<string> | undefined;
    PASSWORD?: string | Resolver<string> | undefined;
    HEADERS?: Headers | Resolver<Headers> | undefined;
    ENCODE_PATH?: ((path: string) => string) | undefined;
};

export const OpenAPI: OpenAPIConfig = {
    BASE: 'http://localhost:8080',
    VERSION: '1.0',
    WITH_CREDENTIALS: true,
    CREDENTIALS: 'include',
    TOKEN: async () => {
        if (typeof window !== 'undefined') {
            const { getSession } = await import('next-auth/react');
            const session = await getSession();
            return session?.backendTokens?.accessToken || '';
        }
        return '';
    },
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
};
`;

    fs.writeFileSync(openApiPath, customOpenAPIConfig);
    console.log(
      'Updated OpenAPI.ts with custom configuration including NextAuth token integration',
    );
  } else {
    console.log('Warning: OpenAPI.ts not found, configuration not updated');
  }
} else {
  console.log('OpenAPI generation failed - no output files found');
  process.exit(1);
}
