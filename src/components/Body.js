import { React, useState } from "react";
import Login from "./Login";
import Search from "./Search";

const Body = (props) => {

    const [error, setError] = useState("");

    return (
        <div className="App-body">
            {(props.user ? (<Search user={props.user} setError={setError} API={props.API} />) : 
                (<Login setUser={props.setUser} setError={setError} API={props.API} />))}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Body;