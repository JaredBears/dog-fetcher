import { React, useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const Login = (props) => {
    const API_URL = props.API + "/auth/login";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setError("");
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name: name, email: email })
        })
        .then((response) => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(response.status);
            }
        })
        .then((data) => {
            props.setUser(name);
        })
        .catch((error) => {
            props.setError("Login Error.  Could not authenticate");
        });
    };

    return (
        <div className="Login">
            <Box 
                component="form"
                sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }}}
                autoComplete="on"
                >
                <TextField variant="outlined" type="text" id="name" placeholder="Enter your name" onChange={(event) => setName(event.target.value)} />
                <br />
                <TextField variant="outlined"t type="text" id="email" placeholder="Enter your email" onChange={(event) => setEmail(event.target.value)} />
                <br />
                <Button variant="contained" type="submit" onClick={handleSubmit}>Login</Button>
            </Box>
        </div>
    );
};

export default Login;