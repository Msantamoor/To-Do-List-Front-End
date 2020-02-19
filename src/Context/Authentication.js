import React from 'react'

export const AuthContext = React.createContext({
    isAuthenticated: false,
    activeList: "none",
    listNum: "",
    authenticate : () => {},
    signout : () => {},
    identify : () => {}
})

