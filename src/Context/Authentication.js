import React from 'react'

export const AuthContext = React.createContext({
    isAuthenticated: false,
    userLogged: "none",
    activeList: "none",
    listNum: "",
    authenticate : () => {},
    signout : () => {},
    identify : () => {}
})

