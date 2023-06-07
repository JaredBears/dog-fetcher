import React from "react";
import { Button } from "@mui/material";

const Header = (props) => {
    return (
        <header className="App-header">
            <h1>{props.text}</h1>
            {props.user && <div className="App-header-user">
                <p>Welcome, {props.user}!</p>
                <Button size="small" variant="contained" onClick={props.logout}>Logout</Button>
            </div>}
        </header>
    );
};

export default Header;