import React, {Component} from 'react';
import DetailedTweet from "./DetailedTweet";

class TweetList extends Component {
    // constructor to save states (component variables) to be used through this
    constructor(props) {
        super(props);
        this.state = {
            // this state (variable) will grab the array of collections straight from the database
            tweetCollectionArray: [],
            // this state (variable) will hold an array of styled HTML for each entry in the database
            mappedTweet: [],
            editCollection: {},
        };
    }

    // This is run when the component is loaded
    componentDidMount() {
        // This called the fetchDatabaseEntries function
        this.fetchDatabaseEntries();
    }

    fetchEditDetails=(e)=>{
        fetch('tweet/edit/'+e.target.name)
            .then(data=>data.json())
            .then(response=>this.setState({editCollection: response}))
            .then(()=>{this.props.changeEdit(true, this.state.editCollection)});
    };



    // Going to GET the URL '/tweet'. The results should be put into JSON, then sent to the movieCollectionArray
    fetchDatabaseEntries = (e) => {
        //Call localhost[PORT]/tweet like you would in POSTMAN. It's GET by default.
        fetch('/tweet/')
        // The response or res from your server is pushed into the variable here. It doesn't have to be named data. It can be anything. If it's a collection put data.json(). If it's a string put data.text()
            .then(data => data.json())
            // Now that the data is a collection again we want to save it in the tweetCollectionArray state so we can call it in a different function.
            .then(data => this.setState(
                // Once the tweetCollectionArray state is saved I want to run the mappedTweetFunction. I have to call it this way so it doesn't run the function before the data is finished being fetched and saved.
                {tweetCollectionArray: data}, () => this.mappedTweetFunction()));
    };

    // This function will map out our tweetCollectionArray and save the style HTML array in the mappedTweet state.
    mappedTweetFunction() {
        // This is saving the tweetCollectionArray map to the mappedArray variable
        const mappedArray = this.state.tweetCollectionArray.map(
            // For each element in the tweetCollection Array to the following function
            (eachElement) => {
                // You want to style each Element using JSX and give it a key
                        return (<div key={eachElement._id}>
                    {/*We want to do all the styling in a different component so we have to send the element as a prop to the component.*/}
                            <DetailedTweet eachElement={eachElement} fetchEditDetails={this.fetchEditDetails}/>
                </div>)
            }
        );
        // Once we're all done the stylized HTML array will be saved in the mappedTweet state
        this.setState({mappedTweet: mappedArray});
    }

    render() {
        return (<div>
            <h1>Trending tweets</h1>
            {/*Print out MappedTweet state with the stylized element array*/}
            <h4>{this.state.mappedTweet}</h4>
        </div>);
    }
}


export default TweetList;
