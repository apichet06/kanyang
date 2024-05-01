'use server'

import axios from 'axios'
import { api } from './utils/config'
import { cookies } from "next/headers"
import { decodeToken } from "./utils/decodeToken"
import { redirect } from 'next/navigation'
export async function login(prevState, formData) {


    try {

        const u_number = formData.get('u_number')
        const u_password = formData.get('u_password')
        const respose = await axios.post(api + '/users/login', { u_number, u_password })
        if (respose.status === 200) {

            // console.log(respose.data.user.u_number);
            cookies().set('token', respose.data.token)

            const token = cookies().get('token');

            const decodedToken = decodeToken(token.value);
            if (decodedToken) {
                console.log("Decoded Token:", decodedToken);
            } else {
                console.log("Failed to decode token.");
            }

            redirect('/home');

            return { message: 'ล็อกอินสำเร็จ!' }
        }
    } catch (error) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
        return { message: 'ล็อกอินไม่สำเร็จ!' }
    }



}