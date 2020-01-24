import React, { Component } from 'react';
import ListTable from './ListTable'

export default class ListDisplay extends Component {

    constructor(props){
        super(props);
        this.state = { 
            clickedLists: [],
            clickedButtons: []
        
        };
    }

    //Maps the listCollection to allow data elements to fit nicely into a div table.
    listTable = () => {
        return this.props.listCollection.map((data, i) => {
            return <ListTable obj={data} key={i} index={i} clickHandler={this.props.clickHandler} 
            editMenu={this.props.editMenu} 
            isClicked={this.props.isClicked} clickedLists={this.props.clickedLists} 
            deleteOneList={this.props.deleteOneList}
            clickedButtons={this.props.clickedButtons} buttonClicked={this.props.buttonClicked}
            unavailableLists={this.props.unavailableLists} />;
        });
    }


    render(){
        const listTable = this.listTable()
        
        return(
            <div className="tableDisplay">
                <div shape="rTable">
                        <div shape="rTableRow">
                            <div shape="rTableCell">Name</div>
                            <div shape="rTableCell">Description</div>
                            <div shape="rTableCell">Due</div>
                        </div>
                    
                        {listTable}
                        
                </div>
            </div>
            

        )
    }

}
