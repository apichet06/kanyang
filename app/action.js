'use server'

import axios from 'axios'
import { api } from './utils/config'
import { cookies } from "next/headers"
import { decodeToken } from "./utils/decodeToken"
import { redirect } from 'next/navigation'
import { LoginAction } from './redirect'
import { useRouter } from 'next/router';

export async function login(prevState, formData) {
    const router = useRouter();
    try {
        const u_number = formData.get('u_number')
        const u_password = formData.get('u_password')
        const response = await axios.post(`${api}/users/login`, {
            u_number,
            u_password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            cookies().set('token', response.data.token)
            // const token = cookies().get('token');

            // const decodedToken = decodeToken(token.value);
            // if (decodedToken) {
            //     console.log("Decoded Token:", decodedToken);
            // } else {
            //     console.log("Failed to decode token.");
            // }

            router.push("/admin");

            return { message: 'ล็อกอินสำเร็จ!', }
        }
    } catch (error) {
        return { message: 'ล็อกอินไม่สำเร็จ!' }
    }
    return { message: 'ล็อกอินไม่สำเร็จ!' }
}