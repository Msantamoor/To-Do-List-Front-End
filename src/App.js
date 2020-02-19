import React, { useState } from 'react';
import './App.css';
import './form.css';
import './Components/Users/SignInForm';
import './Components/Tasks/CreateTaskForm'
import { Links } from './Components/Navigation/Links'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthContext } from './Context/Authentication'


import Main from './Pages/index'
import SignOut from './Components/Navigation/SignOut';

//URL for API
require('dotenv').config()
export const URL = process.env.REACT_APP_apiurl

function App(){
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [state, setState] = useState({
    userLogged: "",
    activeList: "",
    listNum: ""
})

//Provides the logged in state
  const authenticate = () => {
    setAuthenticated(true)
  }

  const signout = () => {
    setAuthenticated(false)
  }

  //Sets the userlogged context value and the activeList context Value for data filtering.
  const identify = (list, pos) => {
    console.log(list)
    console.log(pos)
    setState({activeList: list, listNum: pos })
  }
  
  

  const store = {
    isAuthenticated,
    state,
    authenticate,
    signout,
    identify
  }


  return (
    <div className="App">
      
      <AuthContext.Provider value={store}>
            <Router>
            <SignOut/>
            <Links />
            <Main/>
            </Router> 
      </AuthContext.Provider>
    </div>
  );
}


export default App