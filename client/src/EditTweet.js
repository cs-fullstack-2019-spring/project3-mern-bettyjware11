import React, { Component } from 'react';

class EditTweet extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // This state will hold any successMessages from the server
            successMessage: "",
        };
        console.log("In edit");
        console.log(this.props.entryCollection);
    }
    changeEdit=(editBoolean, editID)=>{
        this.setState({isEditing: editBoolean,
            entryCollection: editID});
    };

    // This function is run when you submit the form and add a new tweet
    submitAdditionalTweet = (e) =>{
        // You need preventDefault to stop the page from reloading. If it reloaded the rest of the function wouldn't run.
        e.preventDefault();
        //Call localhost[PORT]/movie like you would in POSTMAN. It's a POST method as seen below.
        fetch('/tweets', {
            method: "PUT",
            // You need HTML headers so the server knows the data in the HTML body is json.
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            // We want to make the JSON data that's going to the body of the message into a string when we send it to the server.
            body:JSON.stringify({
                _id: this.props.entryCollection._id,
                username: e.target.userame.value,
                password: e.target.password.value,
                tweet:{
                    title:e.target.title.value,
                    author:e.target.author.value,
                    message: e.target.message.value,
                    optionalImageURL: e.target.optionalImageURL.value,
                    privateTweetCheckbox: e.target.privateTweetCheckbox.value
                }
            }),
        })

        // The response or res from your server is pushed into the variable here. Because it's getting a string back we want to use .text()
            .then(data=>data.text())
            // This is saving the string data into the state successMessage
            .then(data=>this.setState({successMessage: data}))
            .then(()=>this.props.changeEdit(false,undefined))
    };

    // The render function will run when you need to update something on the page
    render(){
        // Everything in the return is the JSX that will show up on the page
        return(
            <div>
                <h1>Tweets </h1>
                {/*This form will run the submitAdditionalTweet function when you hit a button in the form*/}
                <form onSubmit={this.submitAdditionalTweet}>
                    {/*The label and input in the p tag keeps them separated from the rest of the label/inputs because a p tag has a block display by default*/}

                    <p>
                        <label htmlFor="title">Enter tweet title here:</label>
                        <input type="text" id={"title"} name={"title"} defaultValue={this.props.entryCollection.tweet.title}/>
                    </p>
                    <p>
                        <label htmlFor="author">Author of Tweet:</label>
                        <input type="text" id={"author"} name={"author"} defaultValue={this.props.entryCollection.tweet.author}/>
                    </p>

                    <p>
                        <label htmlFor="message">Enter the message:</label>
                        <input type="text" id={"message"} name={"message"} defaultValue={this.props.entryCollection.tweet.message}/>
                    </p>

                    <p>
                        <label htmlFor="optionalImageURL">Enter the optionalImageURL:</label>
                        <input type="text" id={"optionalImageURL"} name={"optionalImageURL"} defaultValue={this.props.entryCollection.tweet.optionalImageURL}/>
                    </p>

                    <p>
                        <label htmlFor="privateTweetCheckbox">Private?:</label>
                        <input type="text" id={"privateTweetCheckbox"} name={"privateTweetCheckbox"} defaultValue={this.props.entryCollection.tweet.privateTweetCheckbox}/>
                    </p>


                    {/*When you click this button it will send all the form's data to the submitAdditionalTweet because of the onSubmit call in the beginning of the form*/}
                    <button>Submit</button>
                </form>
                {/*This is going to show a successMessage pulled from the database. It was set in the fetch function above*/}
                <div className={"successMessage"}>{this.state.successMessage}</div>
            </div>
        );
    }
}

export default EditTweet;