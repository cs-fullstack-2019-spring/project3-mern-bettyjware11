import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import TwitterUserHome from "./TwitterUserHome";
import TrendingTweetSignIn from "./TrendingTweetSignIn";
import AddUser from "./AddUser";
import LogOut from "./LogOut";
import AddTweet from "./AddTweet";
import TweetList from "./TweetList";

class App extends Component {
    // constructor to save state (component variables) like isLoggedIn, username, and tweet
    constructor(props) {
        super(props);
        this.state = {
            // isLoggedIn is false because a user is not logged in and so they're null
            username:null,
            isLoggedIn:false,
        }
    }

    // Changes the state (components variables). It's usually called in child components to change the state in this parent component
    // The parameters in here will be replaced with a username, tweet, or true/false if a person is going to be logged in
    loggedInUserInfo = (username, loggedIn) => {
        console.log("Clear");
        this.setState({
            username: username,
            isLoggedIn: loggedIn,
        });
    };

    // Reset the component values back to it's original state by pressing the logout link
    logOut = () => {
        this.setState({
            isLoggedIn: false,
            username: null,
        });
        // This is telling the server to clear the cookie (session) data
        fetch('/users/logout')
            .then(data => data.text())
            // Console log any messages the server sends back
            .then(data => console.log(data));
    };

    render() {
        return (
            <div className="App">

                <TwitterUserHome/>



            </div>
        );
    }
}
export default App;
