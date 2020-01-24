import React from 'react';
import '../../form.css'
import Axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import '../../App';
import { AuthContext } from '../../Context/Authentication';
import {URL} from '../../App'

//Checks for valid form entries
function validate(username, password) {
    return {
        username: username.length === 0,
        password: password.length === 0,
    }
    
}

export default class SIForm extends React.Component {
   
            state = { 
            username: "", 
            password: "",

            touched: {
                username: false, 
                password: false
            },

            attempt: true
        }

    //Setting state with field values on  change
    change = e => {
        this.setState({
        [e.target.name]: e.target.value
        })
    };

    //Allowing css to be applied only after a field has been touched
    handleBlur = (field) => e => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }

    //Attempt Sign-in
    onSubmit = e => {
        e.preventDefault()
        //Pass in username and password to be checked
        Axios.get(`${URL}/users-login?username=${this.state.username}&password=${this.state.password}`)
        .then(res => {
            console.log(res)
            //if the username and password matches, set context value authenticated, and redirect
            if(res.data === 'Sign in Failed'){
                this.setState({
                    username: "", 
                    password: "",

                touched: {
                    username: false, 
                    password: false
                }
                })
                this.setState({ attempt: false})
                console.log(`Matching Failed ${this.state.password}`)
            //if the username and password does not match, display failed login attempt
            } else {
                console.log('Password matches')
                this.context.authenticate(res.data)
                this.setState({ attempt: true})
                this.setState({ redirect: true})
                
            }
        })
        .catch(function(error){
            console.log(error);
        })
       
    }

    render(){

        //Set userLogged context value, and redirect to list selection.
        // if(this.state.redirect){
        //     console.log('login successful')
        //     return(
        //     <AuthContext.Consumer>
        //     {({identify}) => (
        //         <Redirect push={identify(this.context.state.userlogged, this.context.state.activeList)} to={'/Select'}/>
        //     )}
        //     </AuthContext.Consumer>
        //     )
        //     }

        if (this.state.redirect){
            return(
                <Redirect push to={'Select'}/>
            )
        }
    
        //Checks if each field has valid entries
        var errors = validate(this.state.username, this.state.password);        
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        
        //Checks if error css should be shown
        const showErr = (field) => {
            const hasError = errors[field];
            const shouldShow = this.state.touched[field];
      
            return hasError ? shouldShow : false;
          };

        //Checks if good css should be shown
        const showValid = (field) => {
        const shouldShow = this.state.touched[field];

        return shouldShow ? true : false
        
        };

          
        return (
            <div>
            <form>
                <h3>Sign-In</h3>
                <input 
                name="username" 
                maxLength={20}
                className={showErr('username') ? "error" : ""}
                filled={showValid('username') ? "good" : ""}
                onBlur={this.handleBlur('username')}
                placeholder="Username"
                value={this.state.username} 
                onChange={e => this.change(e)}
                />
                <br/>
                <p className={showErr('username') ? "shown-messages" : "hidden-messages"}>Enter Username</p>
                <br/>
                <input 
                name="password"
                maxLength={30}
                className={showErr('password') ? "error" : ""}
                filled={showValid('password') ? "good" : ""}
                onBlur={this.handleBlur('password')}
                placeholder="Password"
                type="password" 
                value={this.state.password} 
                onChange={e => this.change(e)}
                />
                <br/>
                <p className={showErr('password') ? "shown-messages" : "hidden-messages"}>Enter Password</p>
                <br/>
                <p className={this.state.attempt ? "hidden-messages" : "shown-messages"}>Sign-In Failed</p>
                <br/>
                
                <button disabled={!isEnabled} onClick={e => this.onSubmit(e)}>Sign-In</button>
            </form>
            <p>New User?</p> <Link to="/CUForm">Create Account</Link>
            </div>
        )
    }
}
SIForm.contextType = AuthContext;