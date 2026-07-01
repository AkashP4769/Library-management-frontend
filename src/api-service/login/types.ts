export type LoginResponse = {
    access_token: string,
    token_type: string,
    refresh_token: string,
    user?: {
        name?: string,
        username?: string,
    },
    name?: string,
    username?: string,
}

export type LoginPayload = {
    email: string,
    password: string,
}

export type SignupPayload = {
    email: string,
    password: string,
    name: string,
    role: string,
}
