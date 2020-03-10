import React from 'react';
import '../../form.css'
import Axios from 'axios';
import { URL } from '../../App'
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
        Axios.get(`${URL}/users-email-reset`)
        .then(res => {
            if(res === true){
                this.setState({sent: true})
                this.setState({wrong: false})
            }

            if(res === false){
                this.setState({wrong: true})
                this.setState({sent: false})
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
            <p className={this.state.sent ? "shown-messages" : "hidden-messages"}>Email Sent</p>
            <p className={this.state.wrong ? "shown-messages" : "hidden-messages"}>There is no account associated with that email.</p>
            <br/>
            <button onClick={e => this.onSubmit(e)}>Send Request</button>


        </form>

        )
    }



}