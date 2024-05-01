'use server'

import axios from 'axios'
import { api } from './utils/config'
import { cookies } from "next/headers"
import { decodeToken } from "./utils/decodeToken"

import { LoginAction } from './redirect'


export async function login(prevState, formData) {
    let Data = "";
    try {
        const u_number = formData.get('u_number')
        const u_password = formData.get('u_password')
        const respose = await axios.post(api + '/users/login', { u_number, u_password })

        cookies().set('token', respose.data.token)
        if (respose.status === 200) {
            const token = cookies().get('token');

            const decodedToken = decodeToken(token.value);
            if (decodedToken) {
                console.log("Decoded Token:", decodedToken);
            } else {
                console.log("Failed to decode token.");
            }

            // await LoginAction(decodedToken.status)
            Data = 'admin'
            return { message: 'ล็อกอินสำเร็จ!', }
        }
    } catch (error) {
        return { message: 'ล็อกอินไม่สำเร็จ!' }

    }

    console.log('====================================');
    console.log(Data);
    console.log('====================================');

}