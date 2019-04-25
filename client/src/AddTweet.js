import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";

class AddTweet extends Component{
    constructor(props) {
        super(props);
        this.state={
            // This state will hold any successMessages from the server
            successMessage: "",
        };
    }

    submitAdditionalTweet=(e)=> {
        e.preventDefault();
        console.log("Submitting Add Tweet");
        fetch('/tweet',
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,

                    // title: e.target.tweet.title.value,

                    // message: e.target.tweet.message.value,
                    // optionalImageURL: e.target.tweet.optionalImageURL.value,
                    // privateTweetCheckbox: e.target.tweet.privateTweetCheckbox.value

                }),
            })
        // The response or res from your server is pushed into the variable here. Because it's getting a string back we want to use .text()
            .then(data => {
                return data.text()
            })
            // This is saving the string data into the state successMessage
            .then(data => this.setState({successMessage: data}))
    };


    render(){
        return(
            <div>
                <h1>Add New Tweet Here!!</h1>
                <form onSubmit={this.submitAdditionalTweet}>
                    <p>
                        <label htmlFor="username">Enter username:</label>
                        <input type="text" name='username' placeholder="Enter username" />
                    </p>
                    <p>
                        <label htmlFor="password">Enter password:</label>
                        <input type="password" name='password' placeholder="Enter password"/>
                    </p>
                    <p>
                        <label htmlFor="title">Enter the tweet title:</label>
                        <input type="text" name='title' placeholder="Enter title"/>
                    </p>

                    <p>
                        <label htmlFor="message">Enter the tweet message:</label>
                        <input type="text" name='message' placeholder="Enter message" />
                    </p>
                    <p>
                        <label htmlFor="optionalPostImageURL">Enter the tweet optional post image URL:</label>
                        <input type="text" name='optionalPostImageURL' placeholder="Enter optionalPostImageURL" />
                    </p>
                    <p>
                        <label htmlFor="privateTweetCheckbox">Enter the tweet private tweet checkbox:</label>
                        <input type="text" name='privateTweetCheckbox' placeholder="Enter privateTweetCheckbox" />
                    </p>
                    <button>Submit</button>
                </form>
                {/*This is going to show a successMessage pulled from the database. It was set in the fetch function above*/}
                <div className={"successMessage"}>{this.state.successMessage}</div>


            </div>
        );
    }
}

export default AddTweet;
