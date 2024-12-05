// src/auth/session.ts
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { Prisma, PrismaClient } from "@prisma/client";
// or your ORM of choice
// for demonstration purposes we are using Prisma

const prisma = new PrismaClient()

export const generateRandomSessionToken = () => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes)
}

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;  // 30 days

const fromSessionTokenToSessionId = (sessionToken: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)))
}


export const createSession = async (sessionToken: string, userId: string) => {
  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS)
  }
  await prisma.session.create({
    data: session
  })

  return session
}


//function to validate use session
export const validateSession = async (sessionToken: string) => {

  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const result = await prisma.session.findUnique({
    where: {
      id: sessionId
    },
    include: {
      user: true
    }
  })
  // if there is no session, return null
  if (!result) {
    return { session: null, user: null }
  }

  const { user, ...session } = result;

  // if 15 days are left until the session expires, refresh the session
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);

    await prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        expiresAt: session.expiresAt
      }
    })
  }

  return { session, user }


}


//to delete session when user signs out
export const invalidateSession = async (sessionId: string) => {

  await prisma.session.delete({
    where: {
      id: sessionId
    }
  })
}