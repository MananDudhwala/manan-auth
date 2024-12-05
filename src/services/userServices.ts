import { hashPassword } from "src/Auth/password";
import { PrismaClient } from "@prisma/client";
import { createSession, generateRandomSessionToken } from "src/Auth/session";
import { setSessionCookie } from "src/Auth/cookie";

const prisma = new PrismaClient()

export const signUp = async (data: {
    firstname: string,
    lastname: string,
    email: string,
    password: string
}) => {
 
    const passwordHash = await hashPassword(data.password);

    const newUser = await prisma.user.create({
        data: {
            firstName: data.firstname,
            lastName: data.lastname,
            passwordHash: passwordHash,
            email: data.email,
        }
    })

    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, newUser.id);

    await setSessionCookie(sessionToken, session.expiresAt);

    return newUser

}

export const getUser = () => {

}