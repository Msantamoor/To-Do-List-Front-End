import React from 'react';
import '../../form.css'
import Axios from 'axios';
import { URL } from '../../App'
import { Link } from 'react-router-dom';
require('dotenv').config()

export default class FPass extends React.Component{

    state = {
        email: "",
        sent: false,
        wrong: false
    }

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e)  => {
        e.preventDefault()
        Axios.get(`${URL}/users-emails?email=${this.state.email}`)
        .then(res => {
            console.log(res.data)
            if(res.data === false){
                Axios.get(`${URL}/users-email-reset?email=${this.state.email}`)
                .then(res => {
                    this.setState({sent: true})
                    this.setState({wrong: false})
                    console.log(res.data)
                    console.log('Email Sent')
                })
            }

            if(res.data === true){
                this.setState({wrong: true})
                this.setState({sent: false})
                console.log('No Matching Email')
            }

        })
        .catch(function(error){
            console.log(error);
        })

    }

    render(){
        return(
        <form>
            <h3>Enter Email</h3>
            <input 
            name="email"
            value={this.state.email}
            onChange={e => this.change(e)}
            />
            <p className={this.state.sent ? "shown-messages" : "hidden-messages"}>Email Sent, check your email for the reset link</p>
            <p className={this.state.wrong ? "shown-messages" : "hidden-messages"}>There is no account associated with that email.</p>
            <br/>
            <button onClick={e => this.onSubmit(e)}>Send Request</button>
            <br/>
            <p>No account with your email?</p> 
            <Link to="/CUForm">Create one</Link>


        </form>

        )
    }



}