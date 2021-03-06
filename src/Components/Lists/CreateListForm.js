import React from 'react';
import Axios from 'axios';
import { AuthContext } from '../../Context/Authentication';
import { withRouter, Redirect } from 'react-router-dom';
import { URL } from '../../App'
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Cookies = require('js-cookie')


class CLForm extends React.Component{
    state = {
        listname: "",
        desc: "",
        due: "",

        unavailableLists: []
    }

    change = e => {
        this.setState({
        [e.target.name]: e.target.value
        })
    };
    
    //Post a new list with a user attribute, linking the list to the current account, then redirecting
    onSubmit = e => {
        e.preventDefault()
        const user = jwt.sign(jwt.verify(Cookies.get('jwt'), process.env.REACT_APP_signKey), process.env.REACT_APP_postListKey)
        const list = {
            listname: this.state.listname,
            description: this.state.desc,
            due: this.state.due,

            tasks: []
        }
      
        Axios.post(`${URL}/lists?user=${user}`, list)
        .then((res) => {
            console.log(res.data)
            this.setState({
                listname: "",
                desc: "",
                due: ""
            })
            this.setState({ redirect: true })
        }).catch((error) => {
            console.log(error)
        });

        

    }
    
    //Get the unavailable listnames to prevent duplicates
    componentDidMount(){
        if(Cookies.get('jwt')){
            this.context.authenticate()
        } else {
            this.context.signOut()
        }
        this.setState({ unavailableLists: this.props.history.location.state.unavailableLists })
    }

    //Trigger redirect back to list selection
    goBack(){
        this.setState({ redirect: true })
    }
    
    render () {


        //Redirect to list select after a successful post, or by using the back button
        if (this.state.redirect){
            return (
                <Redirect push to={'/Select'}/>
            )
        }

        return(
            <div>
            <form>
                <h3>Create New List</h3>
                <input
                name="listname"
                maxLength={50}
                placeholder="List Name"
                value={this.state.listname}
                onChange={e => this.change(e)}
                />
                {/* Displays a message when the name is a duplicate */}
                <p className={(this.state.unavailableLists.includes(this.state.listname)) ? "shown-messages" : "hidden-messages" } >List names must be unique</p>
                <br/>
                <input
                name="desc"
                maxLength={250}
                placeholder="Type of List"
                value={this.state.desc}
                onChange={e => this.change(e)}
                />
                <br/>
                <input
                name="due"
                maxLength={50}
                placeholder="Timeframe"
                value={this.state.due}
                onChange={e => this.change(e)}
                />
                <br/>
                {/* Disables button when the name is unavailable, preventing duplicates */}
                <button disabled={(this.state.unavailableLists.includes(this.state.name)) ? true : false} 
                onClick={e => this.onSubmit(e)}
                >Add List</button>
                <br/>
                <button type="button" disabled={this.state.listname.length === 0 || this.state.unavailableLists.includes(this.state.listname)} onClick={() => this.goBack()}>Back</button>

            </form>
            </div>
        )
    }

}
export default withRouter(CLForm);
CLForm.contextType = AuthContext