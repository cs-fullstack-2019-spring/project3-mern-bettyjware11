import React, { Component } from 'react';

class Tweet extends Component{

    render(){
        return(
            <div>

                <p>title: {this.props.tweet.title}</p>
                <p>message: {this.props.tweet.message}</p>
                <p>optionalImageURL: {this.props.tweet.optionalImageURL}</p>
                <p>privateTweetCheckbox: {this.props.tweet.privateTweetCheckbox}</p>

                <hr/>
            </div>
        );
    }
}

export default Tweet;