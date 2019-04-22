import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";

class AddTweet extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
        };
    }

    submitAddTweetForm=(e)=>{
        e.preventDefault();
        console.log("Submitting Add Tweet");
        fetch('/users/newtweet',
            {
                method: 'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                    tweet: e.target.tweet.value,
                }),
            })
            .then(data=>{ return data.text()})
            .then(data=>console.log("Message from server: " + data));
        // .then(data=>data.json())
        // .then(message=>this.setState({data:message}));
    };

    render(){
        return(
            <div>
                <h1>Add New Tweet Here!</h1>
                <form onSubmit={this.submitAddTweetForm}>
                    <input type="text" name='username' placeholder="Enter username" autoFocus/>
                    <input type="password" name='password' placeholder="Enter password" />
                    <input type="text" name='tweet' placeholder="Enter tweet" />
                    <button>Submit</button>
                </form>
                {this.state.data}

            </div>
        );
    }
}

export default AddTweet;
