import React from "react";
import { useState } from "react";

const Login = (props) => {
    const API_URL = props.API + "/auth/login";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
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
            console.log(error.message)
        });
    };

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" placeholder="Enter your name" onChange={(event) => setName(event.target.value)} />
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" placeholder="Enter your email" onChange={(event) => setEmail(event.target.value)} />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;