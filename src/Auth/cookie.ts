import { cookieParser, setCookie } from "@utils/utils";
import { CookieOptions } from "express";
import { validateSession } from "./session";
export const SESSION_COOKIE_NAME = "session";

//to store cookies for session management

export const setSessionCookie = async (sessionToken: string, expiresAt: Date) => {
    const sessionCookie: {
        name: string,
        value: string,
        attributes: CookieOptions
    } = {
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        attributes: {
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV == 'production',
            path: "/",
            expires: expiresAt
        }
    }

    setCookie(sessionCookie)
}


//to delete cookies
export const deleteSessionCookie = async () => {
    const cookie = {
        name: SESSION_COOKIE_NAME,
        value: "",
        attributes: {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 0,
        },
    };
    setCookie(cookie)
}

//need to authenticate every request which comes to the server.
//if cookie exists, extract session token and validate the session
// else delete the session
export const getAuth = () => {
    const sessionToken = cookieParser(SESSION_COOKIE_NAME);

    if (!sessionToken) {
        return { session: null, user: null }
    }

    return validateSession(sessionToken)
}