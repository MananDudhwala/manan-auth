import { hashPassword } from "src/Auth/password";
import { PrismaClient } from "@prisma/client";
import { createSession, generateRandomSessionToken } from "src/Auth/session";
import { setSessionCookie } from "src/Auth/cookie";
import { newuser } from "@/types";
import { Response } from "express";

const prisma = new PrismaClient()

export const signUp = async (data: {
    user: newuser,
    response: Response
}) => {

    const passwordHash = await hashPassword(data.user.password);

    const newUser = await prisma.user.create({
        data: {
            firstName: data.user.firstname,
            lastName: data.user.lastname,
            passwordHash: passwordHash,
            email: data.user.email,
        }
    })

    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, newUser.id);

    await setSessionCookie(data.response, sessionToken, session.expiresAt);

    return newUser

}

export const getUser = () => {

}