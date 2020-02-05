import React from 'react';
import Axios from 'axios';
import 'react-router-dom'
import { AuthContext } from '../../Context/Authentication'
import { withRouter, Redirect } from 'react-router-dom';
import '../../form.css'
import { URL } from '../../App'
require('dotenv').config()
const jwt = require('jsonwebtoken')



class EList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            listname: "",
            description: "",
            due: "",
            selection: "",
            unavailableLists: [],
            taskCollection: []
        };

        this.change = this.change.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        
    }

    change = e => {
        this.setState({
        [e.target.name]: e.target.value
        })

    };

    //Patches the list, as well as all tasks with the list attribute so they maintain their association.
    onSubmit = e => {
        e.preventDefault()
        const name = this.props.history.location.state.listname
        const user = jwt.sign(this.context.state.userLogged, process.env.REACT_APP_patchListKey)

        const list = {
            listname: this.state.listname,
            description: this.state.description,
            due: this.state.due,
        }
        //Patch request for the list
        Axios.patch(`${URL}/lists?user=${user}&id=${name}`, list)
        .then((res) => {
            this.setState({
                listname: "",
                desc: "",
                due: ""
            })
            this.setState({redirect: true})
        }).catch((error) => {
            console.log(error)
        });
    }

    //Retrieving current values of the list to populate the fields for easier editting
    componentDidMount(){
        this.setState({
            listname: this.props.history.location.state.listname,
            description: this.props.history.location.state.description,
            due: this.props.history.location.state.due,
            unavailableLists: this.props.history.location.state.unavailableLists
        })
    }

    //Trigger Redirect Back to list selection
    goBack(){
        this.setState({ redirect: true })
    }
    
    render () {

        if(this.state.redirect){
            return (
                <Redirect push to={'/Select'}/>
            )
        }
        
        return(
            <div>
            <form>
                <h3>Edit List</h3>
                <input
                name="listname"
                maxLength={50}
                placeholder="List Name"
                value={this.state.listname}
                onChange={e => this.change(e)}
                />
                {/* Displays message when the name is a duplicate */}
                <p className={(this.state.unavailableLists.includes(this.state.listname)) ? "shown-messages" : "hidden-messages" } > List names must be unique</p>
                <br/>
                <input
                name="description"
                maxLength={250}
                placeholder="What to do"
                value={this.state.description}
                onChange={e => this.change(e)}
                />
                <br/>
                <input
                name="due"
                maxLength={50}
                placeholder="When to have it done"
                value={this.state.due}
                onChange={e => this.change(e)}
                />
                <br/>
                <button disabled={this.state.listname.length === 0 || this.state.unavailableLists.includes(this.state.listname)} onClick={e => this.onSubmit(e)}>Update List</button>
                <br/>
                <button type="button" onClick={() => this.goBack()}>Back</button>


                
            </form>
          
            </div>
        )
        
    }

}

export default withRouter(EList);
EList.contextType = AuthContext;