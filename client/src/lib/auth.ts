'use server'
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";

export async function setToken(token: string) {
    cookies().set({
        name: 'auth',
        value: encrypt(token),
        secure: true,
        httpOnly: true,
        path: '/',
        sameSite: true,
    })
    const response = await fetch(`http://api:${process.env.API_PORT!}${process.env.API_PATHNAME!}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { data } = await response.json();
    setUser(JSON.stringify(data))
}

export async function setUser(data: string) {
    cookies().set({
        name: 'user',
        value: encrypt(data),
        secure: true
    })
}

export async function getUser() {
    const chipertext = cookies().get('user')?.value
    return chipertext ? JSON.parse(decrypt(chipertext)) : null
}

export async function getToken() {
    const chipertext = cookies().get('auth')?.value
    return chipertext ? decrypt(chipertext) : null
}

export async function removeToken() {
    cookies().delete('user')
    cookies().delete('auth')
}

function encrypt(data: string) {
    return CryptoJS.AES.encrypt(data, process.env.SECRET!).toString();
}

function decrypt(data: string) {
    const chipertext = CryptoJS.AES.decrypt(data, process.env.SECRET!);
    return chipertext.toString(CryptoJS.enc.Utf8);
}