export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    fullName: string;
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
};

export type AuthPayload = {
    user: AuthUser;
    accessToken: string;
};

export type ApiSuccessResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type LoginResponse = ApiSuccessResponse<AuthPayload>;
export type RegisterResponse = ApiSuccessResponse<AuthPayload>;
export type MeResponse = ApiSuccessResponse<AuthUser>;