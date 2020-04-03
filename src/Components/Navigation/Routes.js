import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './PrivateRoutes'
import CTForm from '../Tasks/CreateTaskForm'
import CLForm from '../Lists/CreateListForm'
import CUForm from '../Users/CreateUserForm'
import SIForm from '../Users/SignInForm'
import SelectList from '../Lists/SelectList'
import EditTask from '../Tasks/EditTask'
import EditList from '../Lists/EditList'
import FPass from '../Users/ForgotPassword'
import RPass from '../Users/ResetPassword'

export const Routes = () => {
    return (  
          
        <div>
          <Switch>
          <Route exact path="/">
            <SIForm />
          </Route>
          <Route path="/FPass">
            <FPass/>
          </Route>
          <Route path="/RPass">
            <RPass/>
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
  