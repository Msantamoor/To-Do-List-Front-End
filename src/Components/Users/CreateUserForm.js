import React from 'react';
import '../../form.css'
import Axios from 'axios'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { URL } from '../../App'
const bcrypt = require('bcryptjs');
const sha256 = require('sha256')

//onChange form validation, assigning CSS to fields with errors and determining if all fields are valid for submission.
function validate(username, email, password, cpassword) {
    return {
        username: username.length === 0,
        email: email.length === 0,
        password: password.length === 0,
        cpassword: cpassword !== password || cpassword.length === 0
    }
    
}

export default class CUForm extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        cpassword: "",

        touched: {
            username: false, 
            email: false,
            password: false,
            cpassword: false,
        },

        unavailableUsers: [],
        unavailableEmails: []
    };

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

    //Posting a new user to the DB
    onSubmit = async (e) => {
        e.preventDefault()
        const pepper = sha256(this.state.username)
        const salt = bcrypt.genSaltSync(10);
        const sp = pepper + sha256(this.state.password)
        console.log(sp)
        const hash = bcrypt.hashSync(sp, salt)
        console.log(hash)

        const user = {
            username: this.state.username,
            email: this.state.email,
            password: hash,
            salt: salt,

            lists: []
        }
        //Checking to see if username is available
        Axios.get(`${URL}/users-names?username=${this.state.username}`)
        .then(res => {
            //if username is available, check email availability
            if(res.data === true){
            (Axios.get(`${URL}/users-emails?email=${this.state.email}`)
            .then((res) => {
                //if email is available, post new user
                if(res.data === true){
                    console.log(`Email ${this.state.email} Available`)
                    Axios.post(`${URL}/users`, user)
                    .then((res) => {
                        console.log(res.data)
                    }).catch((error) => {
                        console.log(error)
                    });
                    //Clearing forms
                    this.setState({
                        username: "",
                        email: "",
                        password: "",
                        cpassword: "",
    
                        touched: {
                            username: false,  
                            email: false,
                            password: false,
                            cpassword: false,
                        }
    
                    })
                    //Trigger redirect to sign-in form
                    this.setState({ redirect: true})
                    //if email is unavailable, push email to array of unavailable emails to check onChange
                } else if(res.data === false){
                    this.state.unavailableEmails.push(this.state.email)
                    this.setState({email: this.state.email})
                    console.log(`Email ${this.state.email} is already in use`)
                }
            }).catch((error) => {
                console.log(error)
            }))
             
            // if username is unavailable, push username to array of unavailable names to check onChange
            } else if(res.data === false){
                this.state.unavailableUsers.push(this.state.username)
                this.setState({username: this.state.username})
                console.log(`Username ${this.state.username} is unavailable`)
            }
        }) 
        .catch(function(error){
            console.log(error);
        })

    }

    render(){
        //Redirects to sign-in after successful user creation
        if (this.state.redirect) {
            return <Redirect push to={ '/' }/>
          }
        
        //Checks if each field has valid entries
        var errors = validate(this.state.username, this.state.email, this.state.password, this.state.cpassword);        
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
                <h3>New User Registration</h3>
                <input 
                name="username" 
                maxLength={30}
                className={showErr('username') ? "error" : ""}
                filled={showValid('username') ? "good" : ""}
                taken={this.state.unavailableUsers.includes(this.state.username) ? "true" : ""}
                onBlur={this.handleBlur('username')}
                placeholder="Username"
                value={this.state.username} 
                onChange={e => this.change(e)}
                />
                <br/>
                <p className={this.state.unavailableUsers.includes(this.state.username) ? "shown-messages" : "hidden-messages"}> Username unavailable</p>
                <p className={showErr('username') ? "shown-messages" : "hidden-messages"}> Enter Username</p>
                <br/>
                <input 
                name="email"
                maxLength={30}
                className={showErr('email') ? "error" : ""}
                filled={showValid('email') ? "good" : ""}
                taken={this.state.unavailableEmails.includes(this.state.email) ? "true" : ""}
                onBlur={this.handleBlur('email')}
                placeholder="Email Address" 
                value={this.state.email} 
                onChange={e => this.change(e)}
                />
                <br/>
                <p className={this.state.unavailableEmails.includes(this.state.email) ? "shown-messages" : "hidden-messages"}> Email already in use, try Signing In</p>
                <p className={showErr('email') ? "shown-messages" : "hidden-messages"}> Enter a valid Email address</p>
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
                <p className={showErr('password') ? "shown-messages" : "hidden-messages"}>Enter a good password</p>
                <br/>
                <input 
                name="cpassword"
                maxLength={30}
                className={showErr('cpassword') ? "error" : ""}
                filled={showValid('cpassword') ? "good" : ""}
                onBlur={this.handleBlur('cpassword')}
                placeholder="Confirm Password"
                type="password" 
                value={this.state.cpassword} 
                onChange={e => this.change(e)}
                />
                <br/>
                <p className={showErr('cpassword') ? "shown-messages" : "hidden-messages"}>Passwords must match</p>
                <br/>
                <p className={isEnabled ? "shown-messages" : "hidden-messages"}>Ready to submit</p>
                <br/>
                <button disabled={!isEnabled} onClick={e => this.onSubmit(e)}>Create Account</button>
                
            </form>
            <p>Already have an account?</p><Link to="/">Sign-in</Link>
            </div>
            
        )
    }
}