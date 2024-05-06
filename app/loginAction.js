'use server'
import { redirect } from 'next/navigation'

export async function LoginAction(Data) {
    Data === 'admin' ? redirect('/admin') : redirect('/home');
}