import React from 'react';
import '../../form.css'
import Axios from 'axios';
import { URL } from '../../App'
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const sha256 = require('sha256')


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
        const id = urlParams.get('id');
        const username = urlParams.get('username')

        const pepper = sha256(username)
        const salt = bcrypt.genSaltSync(10);
        const sp = pepper + sha256(this.state.password)
        console.log(sp)
        const hash = bcrypt.hashSync(sp, salt)
        console.log(hash)
        
        const idSign = jwt.sign(id, process.env.REACT_APP_changeKey)
        const hashSign = jwt.sign(hash, process.env.REACT_APP_passKey)
        const saltSign = jwt.sign(salt, process.env.REACT_APP_inSaltKey)


        Axios.patch(`${URL}/users-pass-change?id=${idSign}&new=${hashSign}&salt=${saltSign}`)
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