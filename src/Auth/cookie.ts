import { CookieOptions, Request, Response } from "express";
import { validateSession } from "./session";

export const SESSION_COOKIE_NAME = "session";

//to store cookies for session management

export const setSessionCookie = async (res: Response, sessionToken: string, expiresAt: Date) => {
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

    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
}


//to delete cookies
export const deleteSessionCookie = async (res: Response) => {
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
    res.cookie(cookie.name, cookie.value, cookie.attributes);
}

//need to authenticate every request which comes to the server.
//if cookie exists, extract session token and validate the session
// else delete the session
export const getAuth = (req: Request) => {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME] || null;

    if (!sessionToken) {
        return { session: null, user: null }
    }

    return validateSession(sessionToken)
}