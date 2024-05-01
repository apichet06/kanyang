import { redirect } from 'next/navigation'

export async function LoginAction(data) {
    console.log('====================================');
    console.log(data);
    console.log('====================================');


    return redirect('/admin');


}
