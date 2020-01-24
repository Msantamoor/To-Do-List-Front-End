import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoutes'
import CTForm from '../Tasks/CreateTaskForm'
import CLForm from '../Lists/CreateListForm'
import CUForm from '../Users/CreateUserForm'
import SIForm from '../Users/SignInForm'
import SelectList from '../SelectList'
import EditTask from '../Tasks/EditTask'
import EditList from '../Lists/EditList'
// import COForm from '../Users/CreateObjectForm'

export const Routes = () => {
    return (  
          
        <div>
          <Switch>
          <Route exact path="/">
            <SIForm/>
          </Route>
          <PrivateRoute path="/CTForm">
            <CTForm />
          </PrivateRoute>
          <PrivateRoute path="/CLForm">
            <CLForm />
          </PrivateRoute>
          <Route path="/CUForm">
            <CUForm />
          </Route>
          <PrivateRoute path="/Select">
            <SelectList />
          </PrivateRoute>
          <PrivateRoute path="/ETask">
            <EditTask />
          </PrivateRoute>
          <PrivateRoute path="/EList">
            <EditList />
          </PrivateRoute>
          </Switch>
        </div>
    )
  }
  