export const SESSION_COOKIE_NAME =
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || ''

export const MIN_USERNAME_LENGTH = 5
export const MIN_PASSWORD_LENGTH = 8
export const TOTP_PIN_LENGTH = 6

export const AUTH_ROUTES = {
    LOGIN: '/account/login',
    REGISTER: '/account/create',
    RECOVERY: '/account/recovery',
    VERIFY: '/account/verify',
    NEW_PASSWORD: '/account/recovery/new-password',
    AFTER_LOGIN: '/',
}

export const VALIDATION_REGEX = {
    USERNAME: /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
    STRONG_PASSWORD: /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d).+$/u,
    DIGITS_ONLY: /^\d+$/,
}
