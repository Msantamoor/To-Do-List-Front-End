import React from 'react';
import Axios from 'axios';
import 'react-router-dom'
import TaskDisplay from './TaskDisplay';
import { AuthContext } from '../../Context/Authentication'
import { Redirect, withRouter } from 'react-router-dom';
import '../../form.css'
import { URL } from '../../App'




class CTForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            description: "",
            due: "",
            selection: "",
            editId: "",
            taskCollection: [],
            clickedTasks: [],
            clickedTaskNames: [],
            completedTasks: [],
            clickedButtons: [],
            unavailableTasks: [],
            doneDelete: false,
            selectedDelete: false,
            tasksLoaded: false
            
        };

        this.change = this.change.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.editMenu = this.editMenu.bind(this)
        this.isClicked = this.isClicked.bind(this)
        this.isCompleted = this.isCompleted.bind(this)
        this.deleteOneTask = this.deleteOneTask.bind(this)
        this.buttonClicked = this.buttonClicked.bind(this)
        this.setDoneDelete = this.setDoneDelete.bind(this)
        
    }

    change = e => {
        this.setState({
        [e.target.name]: e.target.value
        })

    };

    //Gets updated tasks from the server, filtered by user and list attributes assigned on creation
    refreshTasks(){
        Axios.get(`${URL}/tasks?user=${this.context.state.userLogged}&list=${this.context.state.activeList}&index=${this.context.state.listNum}`)
        .then(res => {
            console.log(this.context.state.listNum)
            console.log(res.data)
            this.setState({
                 taskCollection: res.data,
             });
             this.setState({tasksLoaded: true})
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //Posts a new task to the DB with user and list context values as attributes for filtering
    onSubmit = (e) => {
        e.preventDefault()
        const task = {
            name: this.state.name,
            description: this.state.description,
            due: this.state.due
        }
        Axios.post(`${URL}/tasks?user=${this.context.state.userLogged}&list=${this.context.state.activeList}`, task)
        .then((res) => {
            console.log(res.data)
            this.setState({
                name: "",
                description: "",
                due: ""
            })
            this.refreshTasks()
        }).catch((error) => {
            console.log(error)
        });
    }

    //Refreshes Tasks on mount
    componentDidMount = () => {
        this.refreshTasks()
    }
    
    //Sets state as the current value of the task to edit, to be passed as state on redirect to the update forms.
    //Makes the fields filled with the current values of the list for easier editting.
    editMenu(obj){
        this.setState({
            name: obj.name,
            description: obj.description,
            due: obj.due,
            editId: obj.name
        })
        //Removes current name from the unavailable tasks to allow patching without changing the name.
        this.state.unavailableTasks.splice(this.state.unavailableTasks.indexOf(obj.name), 1);
        this.setState({ redirect: true})
    }

    //Creates an array of all tasks that are currently clicked to display css, and another to target for bulk delete of specific items.
    //Bulk delete needs to work with names rather than ID, Mongo's Object(ID) method has strict rules preventing aggregate syntax.
    //An array of names can be passed in mimicking perfect aggregate query syntax of endless length for specific deletions in bulk -
    //- with one DeleteMany Request to the Database, duplicate protection on create ensures no unintended deletions.
    isClicked(id){
        let clicked = (this.state.clickedTasks.includes(id))
       if(clicked === false){
           this.state.clickedTasks.push(id)
           return clicked === true

       } else if(clicked === true){
           this.state.clickedTasks.splice(this.state.clickedTasks.indexOf(id), 1);
           return clicked === false
       }
    }

    //Creates an array to track clicked buttons for delete confirmation
    buttonClicked(id){
        let clicked = (this.state.clickedButtons.includes(id))
       //console.log(clicked)
       if(clicked === false){
           this.state.clickedButtons.push(id)
           return clicked === true

       } else if(clicked === true){
           this.state.clickedButtons.splice(this.state.clickedButtons.indexOf(id), 1);
           return clicked === false
       }
    }

    //Patches a specific task to update its completed attribute, displaying greyed out css
    //Primes task to be deleted with the other completed tasks in bulk
    isCompleted(id){
            if(this.state.completedTasks.includes(id)){
                const task = "false"
                Axios.patch(`${URL}/tasks-complete?user=${this.context.state.userLogged}&id=${id}&list=${this.context.state.activeList}&complete=${task}`)
            .then((res) => {
                this.state.completedTasks.splice(this.state.completedTasks.indexOf(id), 1);
                this.refreshTasks()
            }).catch((error) => {
                console.log(error)
            });
      
            } else {
                const task = "true"
                Axios.patch(`${URL}/tasks-complete?user=${this.context.state.userLogged}&id=${id}&list=${this.context.state.activeList}&complete=${task}`, task)
            .then((res) => {
                this.state.completedTasks.push(id)
                this.refreshTasks()
            }).catch((error) => {
                console.log(error)
            });
    
            }
      
    }

    //Deletes a specific task by ID
    deleteOneTask(id){
        console.log(id)
        Axios.delete(`${URL}/tasks?user=${this.context.state.userLogged}&id=${id}&list=${this.context.state.activeList}`)
        .then(res => {
            this.state.unavailableTasks.splice(0, this.state.unavailableTasks.length)
            this.refreshTasks()
            //console.log(res)
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //Deletes all tasks in the list with completed: true attributes
    deleteDoneTasks(){
        Axios.delete(`${URL}/tasks-complete?user=${this.context.state.userLogged}&list=${this.context.state.activeList}`)
        .then(res => {
            console.log(res.data)
            this.state.unavailableTasks.splice(0, this.state.unavailableTasks.length)
            this.refreshTasks()
        })
        .catch(function(error){
            console.log(error);
        })
    }

    //Deletes all currently clicked tasks by sending an array of any length to be converted into aggregate query syntax.
    //All specified tasks are deleted with one Mongo deleteMany function
    deleteSelectedTasks(){
        const names = this.state.clickedTasks
            Axios.delete(`${URL}/tasks-selected?user=${this.context.state.userLogged}&list=${this.context.state.activeList}`, {
                params: {
                    names: names
                }
            })
            .then(res => {
                //Clears targeted tasks from the unavailable tasks array after deletion
                this.state.unavailableTasks.splice(0, this.state.unavailableTasks.length)
                this.refreshTasks()
            })
            .catch(function(error){
                console.log(error);
            })
    }

    //Triggers redirect to the list selection
    goBack(){
        this.setState({ back: true })
    }

    //Primes the button to delete all completed tasks after confirmation
    setDoneDelete(){
        if(this.state.doneDelete === false){
            this.setState({ doneDelete: true})
            return true
        } else if(this.state.doneDelete === true){
            this.setState({ doneDelete: false })
            return false
        }
    }
    
    //Primes the button to delete all selected tasks after confirmation
    setSelectedDelete(){
        if(this.state.selectedDelete === false){
            this.setState({ selectedDelete: true })
            return true
        } else if(this.state.selectedDelete === true){
            this.setState({ selectedDelete: false })
            return false
        }
    }

    render () {

        //Redirects to the edit list form, passing in the current list values to populate the fields for easier editting
        if(this.state.redirect){
        return (
            <Redirect push={true} to={{
                pathname: '/ETask',
                state: { 
                    id: this.state.editId,
                    name: this.state.name,
                    description: this.state.description,
                    due: this.state.due,
                    unavailableTasks: this.state.unavailableTasks
                }
            }}/>
        )
        }

        //Redirects back to the list selection
        if(this.state.back){
            return (
                <Redirect push to={'/Select'}/>
            )
        }
        
        return(
            <div>
            <form>
                <h3>Create New Task</h3>
                <input
                name="name"
                maxLength={30}
                placeholder="Task Name"
                value={this.state.name}
                onChange={e => this.change(e)}
                />
                {/* Displays message when the taskname is a duplicate in the same list */}
                <p className={(this.state.unavailableTasks.includes(this.state.name)) ? "shown-messages" : "hidden-messages" }>No duplicate tasks in the same list</p>
                <br/>
                <input
                name="description"
                maxLength={60}
                placeholder="What to do"
                value={this.state.description}
                onChange={e => this.change(e)}
                />
                <br/>
                <input
                name="due"
                maxLength={30}
                placeholder="When to have it done"
                value={this.state.due}
                onChange={e => this.change(e)}
                />
                <br/>
                {/* Prevents submission until the tasks are loaded to ensure duplicate names are known, and the input is valid */}
                <button disabled={this.state.name.length === 0 || (this.state.unavailableTasks.includes(this.state.name)) || (this.state.tasksLoaded === false)} onClick={e => this.onSubmit(e)}>Add Task</button>
                
            </form>
            <h2>{`${this.context.state.activeList}`}</h2>
            <button type="button" onClick={() => this.goBack()}>Back</button>

            {/* Displays retrieved tasks filtered by userLogged and activeList context values */}
            <TaskDisplay taskCollection={this.state.taskCollection} 
            editMenu={this.editMenu} isClicked={this.isClicked} 
            clickedTasks={this.state.clickedTasks} 
            isCompleted={this.isCompleted}
            completedTasks={this.state.completedTasks}
            deleteOneTask={this.deleteOneTask}
            clickedButtons={this.state.clickedButtons}
            buttonClicked={this.buttonClicked}
            unavailableTasks={this.state.unavailableTasks}

            />
            <br/>
            
                {/* Primes completed task delete, revealing real button and a cancel option */}
                <button 
                    onClick={() => this.setDoneDelete()} 
                    shown={this.state.doneDelete ? "hidden" : ""}
                    >Delete Done Tasks</button> 
                
                <button 
                    className="Clicked"
                    onClick={() => this.setDoneDelete()}
                    shown={this.state.doneDelete ? "show" : "hidden"}
                    >Cancel</button>
                
                {/* Primes selected task delete, revealing real button and a cancel option */}
                <button
                    onClick={() => this.setSelectedDelete()}
                    shown={this.state.selectedDelete ? "hidden" : ""}
                    >Delete Selected Tasks</button>

                <button 
                    className="Clicked"
                    onClick={() => this.setSelectedDelete()}
                    shown={this.state.selectedDelete ? "show" : "hidden"}
                    >Cancel</button>
               
                

            <br/>

            {/* Deletes all completed tasks in the list */}
            <button 
                    className="deletebutton"
                    onClick={() => this.deleteDoneTasks()}
                    onClickCapture={() => this.setDoneDelete()}
                    shown={this.state.doneDelete ? "" : "hidden"}
                    >Delete Completed Tasks?</button>

            {/* Deletes all selected tasks in the list */}
            <button 
                    className="deletebutton"
                    onClick={() => this.deleteSelectedTasks()}
                    onClickCapture={() => this.setSelectedDelete()}
                    shown={this.state.selectedDelete ? "" : "hidden"}
                    >Delete Selected Tasks?</button>

                    <br/>
            
            </div>

            

        )
        
    }

}
export default withRouter(CTForm)
CTForm.contextType = AuthContext;