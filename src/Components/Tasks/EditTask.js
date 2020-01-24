import React from 'react';
import Axios from 'axios';
import 'react-router-dom'
import { AuthContext } from '../../Context/Authentication'
import { withRouter, Redirect } from 'react-router-dom';
import { URL } from '../../App'



class ETask extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            description: "",
            due: "",
            selection: "",
            taskCollection: [],
            unavailableTasks: []
        };

        this.change = this.change.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        
    }

    change = e => {
        this.setState({
        [e.target.name]: e.target.value
        })

    };

    //Patches the selected task, then redirects to task display
    onSubmit = (e) => {
        e.preventDefault()
        const user = this.context.state.userLogged
        const id = this.props.history.location.state.id
        const listname = this.context.state.activeList
        const task = {
            name: this.state.name,
            description: this.state.description,
            due: this.state.due
        }
        Axios.patch(`${URL}/tasks?user=${user}&id=${id}&list=${listname}`, task)
        .then((res) => {
            this.setState({
                name: "",
                desc: "",
                due: ""
            })
            this.setState({redirect: true})
        }).catch((error) => {
            console.log(error)
        });
    }

    //Retrieves previous value of task fields for easier editting, as well as unavailable task names.
    componentDidMount(){
        this.setState({
            name: this.props.history.location.state.name,
            description: this.props.history.location.state.description,
            due: this.props.history.location.state.due,
            unavailableTasks: this.props.history.location.state.unavailableTasks
        })
    }

    //Triggers redirect to task display
    goBack(){
        this.setState({ redirect: true })
    }
    
    render () {

        //Redirects to the create task form and the task display
        if(this.state.redirect){
            return (
                <Redirect push to={'/CTForm'}/>
            )
        }
        
        return(
            <div>
            <form>
                <h3>Edit Task</h3>
                <input
                name="name"
                maxLength={20}
                placeholder="Task Name"
                value={this.state.name}
                onChange={e => this.change(e)}
                />
                {/* Shows message when a task name is a duplicate in the same list */}
                <p className={(this.state.unavailableTasks.includes(this.state.name)) ? "shown-messages" : "hidden-messages" } > Task names must be unique</p>
                <br/>
                <input
                name="description"
                maxLength={50}
                placeholder="What to do"
                value={this.state.description}
                onChange={e => this.change(e)}
                />
                <br/>
                <input
                name="due"
                maxLength={20}
                placeholder="When to have it done"
                value={this.state.due}
                onChange={e => this.change(e)}
                />
                <br/>
                {/* Prevents submission unless the task name is unique in the list */}
                <button disabled={this.state.name.length === 0 || (this.state.unavailableTasks.includes(this.state.name))} onClick={e => this.onSubmit(e)}>Update Task</button>
                <br/>
                <button type="button" disabled={(this.state.unavailableTasks.includes(this.state.name)) ? true : false} onClick={() => this.goBack()}>Back</button>


                
            </form>
          
            </div>
        )
        
    }

}

export default withRouter(ETask);
ETask.contextType = AuthContext;