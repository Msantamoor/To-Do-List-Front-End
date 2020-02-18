import React from 'react'

export const AuthContext = React.createContext({
    isAuthenticated: true,
    userLogged: "none",
    activeList: "none",
    listNum: "",
    authenticate : () => {},
    signout : () => {},
    identify : () => {}
})

