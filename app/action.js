'use server'

import axios from 'axios'
import { api } from './utils/config'
import { cookies } from "next/headers"


export async function login(prevState, formData) {


    try {
        const u_number = formData.get('u_number')
        const u_password = formData.get('u_password')
        const respose = await axios.post(api + '/users/login', { u_number, u_password })
        if (respose.status === 200) {

            console.log(respose.data);
            cookies().set('token', respose.data.token)
            cookies().set('user', respose.data.user)
            return { message: 'ล็อกอินสำเร็จ!' }
        }
    } catch (error) {
        return { message: 'ล็อกอินไม่สำเร็จ!' }
    }


    // if (u_number !== 'U1000001' && u_password !== '1234') {
    //     return { message: 'ล็อกอินไม่สำเร็จ!' }
    // }
    // cookies().set('u_number', u_number)
    // console.log(u_number, u_password);

}