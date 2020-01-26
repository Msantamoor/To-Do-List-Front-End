import React, { Component } from 'react';
import '../../form.css'




class TaskTable extends Component {
    state = {
        clickedTasks: [],
        clickedButtons: [],
        unavailableTasks: []
    }
    
    //Checks if each row has been clicked
    checkClicked(id){
        let bool = (this.state.clickedTasks.includes(id))
        return bool
    }

    //Checks if a task is completed
    checkComplete(id){
        let bool = (this.props.completedTasks.includes(id))
        return bool
    }

    //Checks if a delete is ready to be confirmed
    checkDeletable(id){
        let bool = (this.state.clickedButtons.includes(id))
        return bool
    }

    //Sends the names of each row on mount, creating the array of unavailable list names
    //checks for completed attributes on tasks to create the completed tasks array
    componentDidMount(){
        this.props.unavailableTasks.push(this.props.obj.name)
        this.setState({ unavailableTasks: this.props.unavailableTasks})

        if(this.props.obj.completed === "true"){
            this.props.completedTasks.push(this.props.obj.name)
            this.setState({ completedTasks: this.props.completedTasks })
        }
    }

    render() {
        const id = this.props.obj.name

        return (
            <div 
            shape="rTableRow" 
            onClick={() => this.props.isClicked(id)}
            onClickCapture={() => this.setState({clickedTasks: this.props.clickedTasks})}
            className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"} 
            completed={(this.checkComplete(id)) ? "rowCompleted" : ""}
            deletable={(this.checkDeletable(id)) ? "true" : "false"}
            >
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""}>
                    {this.props.obj.name}
                </div>
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""}>
                    {this.props.obj.description}
                </div>
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""}>
                    {this.props.obj.due}
                </div>
                <div 
                shape="rTableCell">
                    {/* Patches the task to change its completed attribute */}
                    <button 
                    className={(this.checkClicked(id)) ? "Clicked" : "notClicked"} 
                    onClick={() => this.props.isCompleted(id)}
                    onClickCapture={() => this.setState({completedTasks: this.props.completedTasks})}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""} 
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Done</button>

                    {/* The real Delete button, only visible after being primed by the first delete button */}
                    <button 
                    className="deletebutton"
                    onClick={() => this.props.deleteOneTask(id)}
                    shown={(this.checkDeletable(id)) ? "" : "hidden"}
                    >Delete Task?</button>
                
                </div>
                <div 
                shape="rTableCell">
                    <button className={(this.checkClicked(id)) ? "Clicked" : "notClicked"} 
                    onClick={() => this.props.editMenu(this.props.obj)}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Edit</button>

                <button 
                    className={(this.checkClicked(id)) ? "Clicked" : ""}
                    onClick={() => this.props.buttonClicked(id)}
                    shown={(this.checkDeletable(id)) ? "show" : "hidden"}
                    >Cancel</button>
                </div>
                <div shape="rTableCell">   

                    {/* Primes the delete function, revealing the button to delete this task after confirmation */}
                    <button 
                    onClick={() => this.props.buttonClicked(id)} 
                    onClickCapture={() => this.setState({clickedButtons: this.props.clickedButtons})}
                    completed={(this.checkComplete(id)) ? "rowCompleted" : ""}
                    className={(this.checkClicked(id)) ? "Clicked" : "notClicked"}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Delete</button> 
                    
                </div>
                    
            </div>
        );
    }
}

export default TaskTable;