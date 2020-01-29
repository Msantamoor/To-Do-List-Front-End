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
        this.props.unavailableLists.push(this.props.obj.listname)
        this.setState({ unavailableLists: this.props.unavailableLists})
    }   

    render() {
        const index = this.props.index
        const id = this.props.obj.listname

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
                    {this.props.obj.listname}
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
                    onClick={() => this.props.clickHandler(id, index)}
                    shown={(this.checkDeletable(id)) ? "hidden" : ""}
                    >Select</button>

                    <button 
                    className="deletebutton"
                    onClick={() => this.props.deleteOneList(id)}
                    shown={(this.checkDeletable(id)) ? "" : "hidden"}
                    >Delete List?</button>
                
                </div>
                <div
                shape="rTableCell">
                    <button className={(this.checkClicked(id)) ? "Clicked" : "notClicked"} 
                    onClick={() => this.props.editMenu(this.props.obj, index)}
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