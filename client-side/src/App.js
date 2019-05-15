import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from './constants/server';
import './App.css';
import Footer from './layout/Footer';
import Home from './Home';
import Login from './auth/Login';
import Navigation from './layout/Navigation';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import Signup from './auth/Signup';
import Board from './pages/Board';
import Task from './pages/Task';
import Sprint from './pages/Sprint';
import Project from './pages/Project';

let async = require("async");


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      projects: [],
      sprints: [],
      tasks: [],
      task: null
    }
  }

  componentDidMount = () => {
    // GET USER INFO
    this.getUser();
    this.loadUserData();
  }

  loadUserData = () => {
    console.log("INSIDE componentDidMount");

    function projectsList(projRet) {
      console.log(`POST ${SERVER_URL}/projects/get`);
      let token = localStorage.getItem('serverToken');
      axios.post(`${SERVER_URL}/projects/get`, {}, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(foundProjects=> {
        console.log('Success getting Projects');
        console.log(foundProjects.data);
        projRet(null, foundProjects.data);
      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      });
    }

    function sprintsList(sprintRet) {
      console.log(`POST ${SERVER_URL}/sprints/get`);
      let token = localStorage.getItem('serverToken');
      axios.post(`${SERVER_URL}/sprints/get`, {}, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(foundSprints=> {
        console.log('Success getting Sprints');
        console.log(foundSprints.data);
        sprintRet(null, foundSprints.data);
      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      });
    }

    function tasksList(taskRet) {
      console.log(`POST ${SERVER_URL}/tasks/get`);
      let token = localStorage.getItem('serverToken');
      axios.post(`${SERVER_URL}/tasks/get`, {}, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(foundTasks=> {
        console.log('Success getting Tasks');
        console.log(foundTasks.data);
        taskRet(null, foundTasks.data);
      })
      .catch(err => {
        console.log('error axios to server:');
        console.log(err);
      });
    }

    async.parallel([projectsList, sprintsList, tasksList], (error, dataLists) => {
      console.log("ready to setState");
      console.log(dataLists);
      this.setState({
        projects: dataLists[0],
        sprints: dataLists[1],
        tasks: dataLists[2]
      });
    });
  }

  // methods for altering existing data for this user
  // at the end of each will setState so front-end page reflects database changes
  addProject = () => {
    let updatedProjects;
    this.setState({projects: updatedProjects});
  }
  removeProject = () => {
    let updatedProjects;
    this.setState({projects: updatedProjects});
  }
  editProject = () => {
    let updatedProjects;
    this.setState({projects: updatedProjects});
  }
  addSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  removeSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  editSprint = () => {
    let updatedSprints;
    this.setState({sprints: updatedSprints});
  }
  addTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  removeTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  editTask = () => {
    let updatedTasks;
    this.setState({tasks: updatedTasks});
  }
  getTask = (taskId) => {
    let token = localStorage.getItem('serverToken');
    axios.post(`${SERVER_URL}/tasks/get/${taskId}`, {}, {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(foundTask=> {
      console.log('Success getting Sprints');
      console.log(foundTask.data);
    })
    .catch(err => {
      console.log('error axios to server:');
      console.log(err);
    });
  }

  resetUser = () => {
    this.setState({user: null});
  }

  getUser = () => {
    // TO do: SEE IF THERE'S A TOKEN
    console.log(localStorage.getItem('serverToken'));
    let token = localStorage.getItem('serverToken');
    if (token) {
      axios.post(`${SERVER_URL}/auth/current/user`,{}, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      .then(response=> {
        console.log(response);
        this.setState({user: response.data.user})
      })
      .catch(err=> {
        this.resetUser();
        console.log('error getting user by token:');
        console.log(err);
      })
    } else {
      this.resetUser();
      console.log('no user token found');
    }

    // IF THERE IS, TRY TO GET USER INFO
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="container">
            <Navigation user={this.state.user} resetUser={this.resetUser} />
            <Route exact path="/" component={Home} />
            <Route path="/login" component={
              () => (
                <Login
                  user={this.state.user}
                  getUser={this.getUser}
                  loadUserData={this.loadUserData}
                />
              )
            } />
            <Route path="/signup" component={
              () => (
                <Signup user={this.state.user} getUser={this.getUser} />
              )
            } />
            <Route path="/profile" component={
              () => (
                <Profile user={this.state.user} />
              )
            } />
            <Route path="/adminprofile" component={
              () => (
                <AdminProfile
                  user={this.state.user}
                  projects={this.state.projects}
                  addProject={this.state.addProject}
                  removeProject={this.state.removeProject}
                  editProject={this.state.editProject}
                />
              )
            } />
            <Route path="/board" component={
              () => (
                <Board user={this.state.user}/>
              )
            } />
            <Route path="/examplesprint" component={
              () => (
                <Sprint
                  user={this.state.user}
                  tasks={this.state.tasks}
                  addTask={this.state.addTask}
                  removeTask={this.state.removeTask}
                  editTask={this.state.editTask}
                />
              )
            } />
            <Route path="/exampletask" component={
              () => (
                <Task user={this.state.user} />
              )
            } />
            <Route path="/exampleproject" component={
              () => (
                <Project
                  user={this.state.user}
                  sprints={this.state.sprints}
                  addSprint={this.state.addSprint}
                  removeSprint={this.state.removeSprint}
                  editSprint={this.state.editSprint}
                />
              )
            } />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
