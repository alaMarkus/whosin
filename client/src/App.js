import React,{useContext} from 'react'
import {BrowserRouter as Router, Switch, Link, Route, useParams} from 'react-router-dom'
import './App.css';
import Navbar from "./components/Navbar"
import CreateEvent from "./components/CreateEvent"
import Event from "./components/Event"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Route path="/">
            <Navbar/>
          </Route>
          <Switch>
          <Route path="/createevent">
            <CreateEvent/>
          </Route>
          <Route path="/signup">
            <Event/>
          </Route>
          <Route path="/event/:eventid">
            <Event />
          </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
