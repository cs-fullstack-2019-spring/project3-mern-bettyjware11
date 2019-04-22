import React, { Component } from 'react';

class TweetList extends Component{
    // constructor to save states (component variables) to be used through this
    constructor(props) {
        super(props);
        this.state={
            tweets:[],
            mappedTweets:[],
        };
    }

    // This runs when the component is first loaded
    componentDidMount() {
        // Fetch the tweetData whether they are logged in or not
        this.fetchUserTweetData();
    }

    // Run this function to log in a user and create a cookie
    signInUser=(e)=>{
        // Prevents default behavior like reloading the page before the function is run
        e.preventDefault();
        console.log("Submitting Log in");
        // Fetches the '/login' route in the users.js group as a POST method
        fetch('/users/login',
            {
                method: 'POST',
                // Accept tells the server what kind of data the client is expecting.
                // Content-Type tells the server which kind of data the client is sending in the body
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                // Creates a collection for username and password. Because a request can't send a collection, you have to make it a JSON string first
                // e.target is the information being sent from the form input fields by their names give in the input attributes. The value is what was typed.
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            })
        // data on the left side is the raw response data the server sent (res.send)
        // On the right side, use that data parameter with the .text function to change data to normal text.
            .then(data=>{ return data.text()})
            // response on the left side is the readable text data.
            // on the right side we're saving the readable text data that's saved in response into the loggedInUserInfo function. That is updating the state in the parent function BlogHome.
            .then(response=>{if(response) {
                // loggedInUserInfo first parameter is username, the second is loggedIn. If there is a response (username is sent), then make loggedIn true
                this.props.loggedInUserInfo(response, true);
                // Now that I have the user's username, I want to fetch the tweetArray and save it as a state
                return this.fetchUserTweetData();
            }
            // If there is no response, it sends an undefined username and false as loggedIn
            else
                return this.props.loggedInUserInfo(response, false)});
    };

    // Fetch the signed in user's collection and save it in Tweets
    fetchUserTweetData(){
        // Fetches the '/grabTweets' route in the users.js group as a GET method
        fetch('/users/grabTweets')
        // data on the left side is the raw response data the server sent (res.send)
        // On the right side, use that data parameter with the .json function to change data to a readable JSON collection.
            .then(data=>data.json())
            // response on the left side is the readable JSON collection.
            // on the right side we're setting the tweets state as the server's response. Afterwards, we're running a the mappedTweetsFunction to map out each favoriteTweetsArray entry styling.
            .then(response=> {
                return this.setState({tweets: response.tweets}, () => this.mappedTweetsFunction())
            });
    }

    // Map the user's tweets into a the mappedTweets state
    mappedTweetsFunction(){
        // This variable will be the mapped Array saved in the state
        let mapArray = [];

        console.log(this.state.tweets);
        // Create a temporary array until you know if the tweetsArray is empty. If the tweetsArray has data, it will be saved in here. Otherwise, it would be undefined and break everything if we didn't save it as an empty array.
        let tempArray = [];
        // If there are items in the tweetsArray
        if(this.state.tweets)
        // Save the array in the tempArray
            tempArray = this.state.tweets;

        // if the tempArray has something in it (being entries)
        if(tempArray.length>0) {
            // Map each item in the array to the return JSX below
            mapArray = this.state.tweets.map(
                (eachElement, index) => {
                    // We REALLY should be creating a new key for each item, but we're being lazy and using index instead right now. The console.log will probably yell at us.
                    return (<div key={index}>
                        <p>{eachElement}</p>
                    </div>)
                }
            );
            console.log(mapArray);
        }
        // If the todoArray doesn't have anything in it
        else {
            console.log("no tweets for " + this.props.logInfo.username);
            // Make mapArray empty
            mapArray = [];
        }
        // Save the state of the mapArray so you can display all of it's entries
        this.setState({mappedTweets:mapArray});
    }

    render(){
        return(
            <div>
                {/*If a user is logged in*/}
                {this.props.logInfo.loggedIn?
                    // Render the username and the mapped Tweets
                    (<div>
                        <h1>{this.props.logInfo.username}'s data</h1>
                        {this.state.mappedTweets}
                    </div>):
                    // If the user is not logged in. Render the log in form.
                    (<div>
                            <p>Please log in</p>
                            {/*Form for entering an existing user information. Once you submit the form it runs signInUser*/}
                            <form onSubmit={this.signInUser}>
                                <p>
                                    <label htmlFor={"username"}>Enter username:</label>
                                    <input type="text" name={"username"} id={"username"}/>
                                </p>
                                <p>
                                    <label htmlFor={"password"}>Enter password:</label>
                                    <input type="text" name={"password"} id={"password"}/>
                                </p>
                                <button>Sign In</button>
                            </form>
                        </div>
                    )}
            </div>
        );
    }
}
export default TweetList;
