import TweetContext from "./tweetContext";
import {useState} from "react";

const TweetState = ({children})=>{
    const [tweetState, setTweetState] = useState({});
    return (
        <TweetContext.Provider value = {{tweetState, setTweetState}}>
            {children}
        </TweetContext.Provider>
    )
}

export default TweetState;