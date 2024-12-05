import { CookieOptions } from "express";

export function setCookie(data: { name: string, value: string, attributes: CookieOptions }): void {
    let cookieString = `${encodeURIComponent(data.name)}=${encodeURIComponent(data.value)}`;

    for (const [key, attrValue] of Object.entries(data.attributes)) {
        if (attrValue === true) {
            cookieString += `; ${key}`;
        } else if (attrValue !== false && attrValue != null) {
            cookieString += `; ${key}=${attrValue instanceof Date ? attrValue.toUTCString() : attrValue}`;
        }
    }

    document.cookie = cookieString;
}

export function cookieParser(cookieName: string): string | null {
    const cookies = document.cookie.split("; ").reduce<Record<string, string>>((acc, cookie) => {
        const [name, value] = cookie.split("=");
        if (name) {
            acc[decodeURIComponent(name)] = decodeURIComponent(value || "");
        }
        return acc;
    }, {});

    return cookies[cookieName] ?? null;
}