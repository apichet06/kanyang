
import { decodeToken } from "./decodeToken"
import Cookies from 'js-cookie';
import React from 'react'

export function Showuserlogin() {
    const token = Cookies.get('token');
    const decodedToken = decodeToken(token);
    return (
        <div>{decodedToken.username}</div>
    )
}
