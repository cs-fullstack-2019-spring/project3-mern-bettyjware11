import React, { Component } from 'react';
import TrendingTweetSignIn from "./TrendingTweetSignIn";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";


// Renders an h1 when the Log Out Link is clicked
class LogOut extends Component{
    render(){
        return(
            <div>
                <h1>You are Not Signed In!!</h1>
                {/*link set up for user to sign in*/}
                <p>To sign in click
                    <Link to={"/addUser"}>Create user</Link>
                </p>
            </div>
        );
    }
}

export default LogOut;
