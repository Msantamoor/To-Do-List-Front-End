import React, { useContext } from 'react'

import { AuthContext } from '../../Context/Authentication'
 
function SignOut() {
    let context = useContext(AuthContext)

    return context.isAuthenticated ? (
            <button
                onClick={() => {
                    context.signout();
                }}
            >
                Sign out
      </button>
    ) : (
            <p>Sign in to view lists</p>
        );
}

export default SignOut;