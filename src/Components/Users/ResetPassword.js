import React from 'react';
import '../../form.css'
import Axios from 'axios';
import { URL } from '../../App'
require('dotenv').config()


export default class RPass extends React.Component{

    state = {
        password: "",
        confirm: "",
        successful: false,
        failed: false
    }


    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('user');

        Axios.patch(`${URL}/users-pass-change?user=${myParam}&new=${this.state.password}`)
        .then(res => {
            if(res.data === true){
                this.setState({successful: true})
            }
            else {
                this.setState({failed: true})
            }

        })
        .catch(function(error){
            console.log(error)
        })

    }


    render(){
        return(
            <form>
                <h3>Enter New Password</h3>
                <input
                name="password"
                value={this.state.password}
                onChange={e => this.change(e)}
                />

                <p>Confirm New Password</p>
                <input
                name="confirm"
                value={this.state.confirm}
                onChange={e => this.change(e)}
                />
                <p className={this.state.password !== this.state.confirm ? "shown-messages" : "hidden-messages"}>Passwords do not Match</p>
            <br/>
                <button
                disabled={this.state.password !== this.state.confirm}
                onClick={e => this.onSubmit(e)}>Reset Password</button>

            </form>

        )
    }

}