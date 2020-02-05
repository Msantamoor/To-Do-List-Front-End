import React, { Component } from 'react';
import ListDisplay from './ListDisplay';
import Axios from 'axios'
import { Redirect } from 'react-router';
import {AuthContext} from '../../Context/Authentication'
import '../../App.css'
import { URL } from '../../App'
require('dotenv').config()
const jwt = require('jsonwebtoken')

export default class SelectList extends Component {
  constructor(props){
    super(props)

    this.state = {
      selection: "",
      listNumber: "",
      listCollection: [],
      clickedLists: [],
      clickedButtons: [],
      unavailableLists: [],
      editId: "",
      listsLoaded: false
      
    }


    this.clickHandler = this.clickHandler.bind(this)
    this.isClicked = this.isClicked.bind(this)
    this.deleteOneList = this.deleteOneList.bind(this)
    this.buttonClicked = this.buttonClicked.bind(this)
    this.editMenu = this.editMenu.bind(this)

  }


  //Gets current lists from the DB, filtered by the current userLogged
  refreshLists = () => {
    const user = jwt.sign(this.context.state.userLogged, process.env.REACT_APP_getListKey)
    Axios.get(`${URL}/lists?user=${user}`)
        .then(res => {
            console.log(res.data)
            this.setState({ listCollection: res.data,
            listsLoaded: true })

        })
        .catch(function(error){
            console.log(error)
        })
  }

  //Refreshes to grab current lists on mount
  componentDidMount(){
  this.refreshLists()
  }

  //Stores a clicked state for each list to display the CSS and the menu
  isClicked(id){
    let clicked = (this.state.clickedLists.includes(id))
    if(clicked === false){
        this.state.clickedLists.push(id)
        return clicked === true

    } else if(clicked === true){
        this.state.clickedLists.splice(this.state.clickedLists.indexOf(id), 1);
        return clicked === false
    }
  }

  //stores a clicked state for buttons
  buttonClicked(id){
    let clicked = (this.state.clickedButtons.includes(id))
    if(clicked === false){
        this.state.clickedButtons.push(id)
        return clicked === true

    } else if(clicked === true){
        this.state.clickedButtons.splice(this.state.clickedButtons.indexOf(id), 1);
        return clicked === false
    }
  }

  //Selects a list, setting the name as the current selection and triggering a redirect
  clickHandler(name, pos) {
    console.log(name)
    this.setState({ selection: name });
    this.setState({ listNumber: pos})
    this.setState({ redirect: true });
  }

  //triggers a redirect to the create list form
  addlist(){
    this.setState({ redirect2: true })
    
  }

  //Deletes a list by ID, and all tasks with that list attribute
  deleteOneList(id){
    console.log(id)
    const user = jwt.sign(this.context.state.userLogged, process.env.REACT_APP_deleteListKey)
    Axios.delete(`${URL}/lists?user=${user}&list=${id}`)
    .then(res => {
      //Removes this listname from the unavailable lists for duplicate protection.
        this.state.unavailableLists.splice(this.state.unavailableLists.indexOf(id), 1);
        this.refreshLists()
    })
    .catch(function(error){
        console.log(error);
    })
  }

//Sets state as the current value of the list to edit, to be passed as state on redirect to the update forms.
//Makes the fields filled with the current values of the list for easier editting.
  editMenu(obj, index){
        this.setState({
            listname: obj.listname,
            description: obj.description,
            due: obj.due,
            editId: index
        })
        //Removes current name from the unavailable lists to allow patching without changing the name.
        this.state.unavailableLists.splice(this.state.unavailableLists.indexOf(obj.listname), 1);
        this.setState({ redirect3: true})
  }

  render() {

    //Redirects to task display, setting the context activeList value to filter for relevant tasks,
    //resetting the userLogged context value as it's current value to prevent the logged state from being cleared
    if (this.state.redirect) {
      console.log(this.state.selection)
        return(
          <AuthContext.Consumer>
            {({identify}) => (
                <Redirect push={identify(this.context.state.userLogged, this.state.selection, this.state.listNumber)} to={'/CTForm'}/>
            )}
          </AuthContext.Consumer>
          
        )
    }

    //Redirects to the create list form, passing in the currently used names as unavailable to prevent duplicates
    if (this.state.redirect2){
        return (
          <Redirect push={true} to={{
            pathname: '/CLForm',
            state: {
              unavailableLists: this.state.unavailableLists
            }
          }}/>
        )
    }

    //Redirects to the edit list form, passing in the current list values to populate the fields for easier editting.
    if(this.state.redirect3){
        return (
          <Redirect push={true} to={{
            pathname: '/EList',
            state: {
              id: this.state.listname,
              listname: this.state.listname,
              description: this.state.description,
              due: this.state.due,
              unavailableLists: this.state.unavailableLists
            }
          }}/>
        )
    }

    return (
      <div>
        {/* Forces the add list button to wait until the current lists are retrieved from the database,
        ensuring the unavailable list names can be sent to the create form, preventing duplicates. */}
        <button disabled={this.state.listsLoaded ? false : true} onClick={() => this.addlist()}>Create New List</button>
        
        {/* Displays the retrieved lists filtered by the userLogged context. */}
        <ListDisplay listCollection={this.state.listCollection} clickHandler={this.clickHandler} 
        editMenu={this.editMenu} 
        isClicked={this.isClicked} clickedLists={this.state.clickedLists} 
        deleteOneList={this.deleteOneList}
        clickedButtons={this.state.clickedButtons} buttonClicked={this.buttonClicked}
        unavailableLists={this.state.unavailableLists} />
        
      </div>
    );
    }
  }

SelectList.contextType = AuthContext;
