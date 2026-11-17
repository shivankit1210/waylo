import type { AuthTokens, LoginCredentials, RegisterData, User } from '@waylo/shared';
export declare function login(credentials: LoginCredentials): Promise<AuthTokens>;
export declare function register(data: RegisterData): Promise<AuthTokens>;
export declare function getMe(): Promise<User>;
export declare function logout(): Promise<void>;
//# sourceMappingURL=api.d.ts.map