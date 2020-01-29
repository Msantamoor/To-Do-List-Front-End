import React from 'react';
import Axios from 'axios';
import { AuthContext } from '../../Context/Authentication';
import { withRouter, Redirect } from 'react-router-dom';
import { URL } from '../../App'


class CLForm extends React.Component{
    state = {
        name: "",
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

        const list = {
            listname: this.state.name,
            description: this.state.desc,
            due: this.state.due,

            tasks: []
        }
      
        Axios.post(`${URL}/lists?user=${this.context.state.userLogged}`, list)
        .then((res) => {
            console.log(res.data)
            this.setState({
                name: "",
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
                name="name"
                maxLength={20}
                placeholder="List Name"
                value={this.state.name}
                onChange={e => this.change(e)}
                />
                {/* Displays a message when the name is a duplicate */}
                <p className={(this.state.unavailableLists.includes(this.state.name)) ? "shown-messages" : "hidden-messages" } >List names must be unique</p>
                <br/>
                <input
                name="desc"
                maxLength={50}
                placeholder="Type of List"
                value={this.state.desc}
                onChange={e => this.change(e)}
                />
                <br/>
                <input
                name="due"
                maxLength={20}
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
                <button type="button" onClick={() => this.goBack()}>Back</button>

            </form>
            </div>
        )
    }

}
export default withRouter(CLForm);
CLForm.contextType = AuthContext