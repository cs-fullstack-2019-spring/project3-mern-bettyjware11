import React, { Component } from 'react';
import TweetList from "./TweetList";

class DetailedTweet extends Component{
    // The render function will run when you need to update something on the page
    render(){
        // Everything in the return is the JSX that will show up on the page
        return(
            <div>
                {/*This is using the props eachElement that was passed to it from the TweetList component and showing username */}
                <p>
                    {this.props.eachElement.username} has
                    <button name={this.props.eachElement._id} onClick={this.props.fetchEditDetails}>Edit</button>
                    {this.props.eachElement.tweet}{this.props.eachElement.tweet.title}
                     {this.props.eachElement.tweet.message}
                    {this.props.eachElement.tweet.optionalImageURL}  {this.props.eachElement.tweet.privateTweetCheckbox}
                </p>


            </div>
        );
    }
}

export default DetailedTweet;