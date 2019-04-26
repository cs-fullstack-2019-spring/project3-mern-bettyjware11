import React, {Component} from 'react';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import TweetList from "./TweetList";
import TrendingTweetSignIn from "./TrendingTweetSignIn";
import AddUser from "./AddUser";
import EditTweet from "./EditTweet";
import LogOut from "./LogOut";
import LoggedInData from "./LoggedInData";
import AddTweet from "./AddTweet";

class TwitterUserHome extends Component {
    // constructor to save state (component variables) like isLoggedIn, username, and tweet
    constructor(props) {
        super(props);
        this.state = {
            // isLoggedIn is false because a user is not logged in and so they're null
            isLoggedIn: false,
            username: null,
            tweet: null,
            entryCollection: -1,
        };
    }

    changeEdit = (editBoolean, editID) => {
        this.setState({
            isEditing: editBoolean,
            entryCollection: editID
        });
    };


    // Changes the state (components variables). It's usually called in child components to change the state in this parent component
    // The parameters in here will be replaced with a username, tweet, or true/false if a person is going to be logged in
    loggedInUserInfo = (username, tweet, loggedIn) => {
        console.log("Clear");
        this.setState({
            username: username,
            tweet: tweet,
            isLoggedIn: loggedIn,
        });
    };

    // Reset the component values back to it's original state by pressing the logout link
    logOut = () => {
        this.setState({
            isLoggedIn: false,
            username: null,
            tweet: null,
        });
        // This is telling the server to clear the cookie (session) data
        fetch('/users/logout')
            .then(data => data.text())
            // Console log any messages the server sends back
            .then(data => console.log(data));
    };


    // Renders the JSX for a component
    render() {
        return (
            <div>
                <h1>Welcome to BTweet Home Page</h1>
                {/*This allows Route and Link to work*/}
                <Router>
                    <nav>
                        {/*Link provides a link to specified routes*/}
                        <Link to={"/"}>Home</Link>
                        <Link to={"/addUser"}>Create User</Link>
                        <Link to={"/addTweet"}>Add Tweet</Link>
                        {/*This link has a onClick button to run the logOut function when clicked*/}
                        <Link to={"/logout"} onClick={this.logOut}>Log Out</Link>
                        {/*This link has a onClick button to run the edit function when clicked*/}
                        {/*<Link to={"/addTweet"}>Add Tweet</Link>*/}
                    </nav>
                    {/*Connects the link to the specified component to render*/}
                    {/*In order to pass in variables or functions in the Route you to use component={()=><YourComponentHere/>}. If you don't have to pass anything you can use component={YourComponentHere} */}
                    <Route exact path={"/"} component={() => <TrendingTweetSignIn isLoggedIn={this.state.isLoggedIn}
                                                                                  username={this.state.username}
                                                                                  tweetTitle={this.state.tweetTitle}
                                                                                  loggedInUserInfo={this.loggedInUserInfo}/>}/>
                    <Route path={"/addUser"} component={() => <AddUser/>}/>
                    <Route path={"/logout"} component={() => <LogOut/>}/>
                    <Route path={"/addTweet"} component={() => <AddTweet/>}/>

                    {/*This shows a list of tweets*/}
                    <Route path="/" exact
                           component={()=><TweetList collection={this.state.collection} updateDatabaseData={this.updateDatabaseData}/>
                           }/>



                </Router>
                {/*<div>*/}
                {/*<TweetList changeEdit={this.changeEdit}/>*/}



                {/*</div>*/}
            </div>


        );
    }
}

export default TwitterUserHome;