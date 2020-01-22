import React, { Component } from 'react';




class ListTable extends Component {
    state = {
        clickedLists: [],
        clickedButtons: [],
        unavailableLists: []
    }
    
    //Checks if each row has been clicked
    checkClicked(id){
        let bool = (this.state.clickedLists.includes(id))
        return bool
    }

    //Checks if a delete is ready to be confirmed
    checkDeletable(id){
        let bool = (this.state.clickedButtons.includes(id))
        return bool
    }

    //Sends the names of each row on mount, creating the array of unavailable list names
    componentDidMount(){
        this.props.unavailableLists.push(this.props.obj.name)
        this.setState({ unavailableLists: this.props.unavailableLists})
    }   

    render() {
        const listname = this.props.obj.name
        const id = this.props.obj._id

        return (
            
            <div 
            shape="rTableRow"
            onClick={() => this.props.isClicked(id)}
            onClickCapture={() => this.setState({clickedLists: this.props.clickedLists})}
            className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"} 
            deletable={(this.checkDeletable(id)) ? "true" : "false"}
            >
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}>
                    {this.props.obj.name}
                </div>
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}>
                    {this.props.obj.description}
                </div>
                <div 
                shape="rTableCell"
                className={(this.checkClicked(id)) ? "rowClicked" : "rowNotClicked"}>
                    {this.props.obj.due}
                </div>
            <div>
                <div
                shape="rTableCell">
                    <button 
                    className={(this.checkClicked(id)) ? "Clicked" : "notClicked"} 
                    onClick={() => this.props.clickHandler(listname)}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Select</button>

                    <button 
                    className="deletebutton"
                    onClick={() => this.props.deleteOneList(id, listname)}
                    shown={(this.checkDeletable(id)) ? "" : "hidden"}
                    >Delete List?</button>
                
                </div>
                <div
                shape="rTableCell">
                    <button className={(this.checkClicked(id)) ? "Clicked" : "notClicked"} 
                    onClick={() => this.props.editMenu(this.props.obj)}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Edit</button>

                    <button 
                    className={(this.checkClicked(id)) ? "Clicked" : ""}
                    onClick={() => this.props.buttonClicked(id)}
                    shown={(this.checkDeletable(id)) ? "show" : "hidden"}
                    >Cancel</button>
                </div>
                </div>
                <div
                shape="rTableCell">    
                    <button 
                    onClick={() => this.props.buttonClicked(id)} 
                    onClickCapture={() => this.setState({clickedButtons: this.props.clickedButtons})}
                    className={(this.checkClicked(id)) ? "Clicked" : "notClicked"}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Delete</button> 
                    
                </div>
            </div>
            
        );
    }
    
}

export default ListTable;