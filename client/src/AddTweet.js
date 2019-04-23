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

    submitAddTweetForm=(e)=>{
        e.preventDefault();
        console.log("Submitting Add Tweet");
        fetch('/tweet',
            {
                method: 'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({

                    title: e.target.tweet.title.value,
                    author: e.target.tweet.author.value,
                    message: e.target.tweet.message.value,
                    optionalImageURL: e.target.tweet.optionalImageURL.value,
                    privateTweetCheckbox: e.target.tweet.privateTweetCheckbox.value

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
                <h1>Add New Tweet Here!!</h1>
                <form onSubmit={this.submitAddTweetForm}>
                    {/*<p>*/}
                    {/*    <label htmlFor="username">Enter username:</label>*/}
                    {/*    <input type="text" name='username' placeholder="Enter username" autoFocus/>*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    <label htmlFor="password">Enter password:</label>*/}
                    {/*    <input type="password" name='password' placeholder="Enter password"/>*/}
                    {/*</p>*/}
                    <p>
                        <label htmlFor="title">Enter the tweet title:</label>
                        <input type="text" name='title' placeholder="Enter title"/>
                    </p>
                    <p>
                        <label htmlFor="author">Enter the tweet author:</label>
                        <input type="text" name='author' placeholder="Enter author" />
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
                {this.state.data}

            </div>
        );
    }
}

export default AddTweet;
