import React, { useContext } from 'react'

import { AuthContext } from '../../Context/Authentication'
const Cookies = require('js-cookie')
 
function SignOut() {
    let context = useContext(AuthContext)

    return context.isAuthenticated ? (
            <button
                onClick={() => {
                    Cookies.remove('jwt')
                }} onClickCapture={() => {
                    context.signout()
                }}
            >
                Sign out
      </button>
    ) : (
            <p>Sign in to view lists</p>
        )
}

export default SignOut;