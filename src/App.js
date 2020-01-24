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
// export const URL = 'https://to-do-list-server-api.herokuapp.com'
export const URL = 'http://localhost:3306'

function App(){
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [state, setState] = useState({
    userLogged: "",
    activeList: "",
    listNum: ""
})

//Provides the logged in state
  const authenticate = (id) => {
    setAuthenticated(true)
    setState({ userLogged: id })
  }

  const signout = () => {
    setAuthenticated(false)
  }

  //Sets the userlogged context value and the activeList context Value for data filtering.
  const identify = (user, list, pos) => {
    console.log(user)
    console.log(list)
    console.log(pos)
    setState({ userLogged: user, activeList: list, listNum: pos })
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