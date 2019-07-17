import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import '../styles/App.css';
import Auth from './Auth'
import Events from './Events'
import Bookings from './Bookings'

class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Redirect from="/" to="/auth" exact />
                        <Route path="/auth"     component={ Auth } />
                        <Route path="/users"    component={ null } />
                        <Route path="/events"   component={ Events } />
                        <Route path="/bookings" component={ Bookings } />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
