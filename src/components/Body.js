import { React, useState } from "react";
import Login from "./Login";
import Search from "./Search";

const Body = (props) => {

    const [user, setUser] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="App-body">
            {(user ? (<Search user={user} setUser={setUser} setError={setError} API={props.API} />) : 
                (<Login setUser={setUser} setError={setError} API={props.API} />))}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Body;