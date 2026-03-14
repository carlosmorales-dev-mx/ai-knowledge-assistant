export type LoginRequest = {
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

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        user: AuthUser;
        accessToken: string;
    };
};