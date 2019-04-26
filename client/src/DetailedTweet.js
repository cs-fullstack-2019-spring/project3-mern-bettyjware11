import React, {Component} from 'react';
// import TweetList from "./TweetList";
import Tweet from "./Tweet";

class DetailedTweet extends Component {
    constructor(props) {
        super(props);
        // this.state.tweet=[]
    }

    // The render function will run when you need to update something on the page
    render() {
        // Everything in the return is the JSX that will show up on the page
        return (
            <li>
                {/*This is using the props eachElement that was passed to it from the MovieListing component and showing movieName and genre*/}
                <p>{this.props.eachElement.username} has
                    {/*<Tweet tweet={this.props.eachEntry.tweet}/>*/}

                </p>
                <hr/>
            </li>
        );
    }
}


export default DetailedTweet;
