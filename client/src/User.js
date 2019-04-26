import React, { Component } from 'react';
import Tweet from "./Tweet";

class User extends Component{
    constructor(props){
        super(props);

    }



    render(){
        return(
            <li>

                <p>title: {this.props.eachEntry.title}</p>
                <p>message: {this.props.eachEntry.message}</p>
                <p>optionalImageURL: {this.props.eachEntry.optionalImageURL}</p>
                <p>privateTweetCheckbox: {this.props.eachEntry.privateTweetCheckbox}</p>

                <hr/>
            </li>
        );
    }
}

export default User;
