import { React, useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const Login = (props) => {
    const API_URL = props.API + "/auth/login";

    const [formValues, setFormValues] = useState(
        {
            name: {
                value: "",
                error: false,
                errorMessage: "You must enter a name."
            },
            email: {
                value: "",
                error: false,
                errorMessage: "You must enter a valid email."
        }
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ 
            ...formValues, 
            [name]: { 
                ...formValues[name], value 
            } 
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setError("");

        const formFields = Object.keys(formValues);
        let formNewValues = { ...formValues };

        for (let i = 0; i < formFields.length; i++) {
            const field = formFields[i];
            const value = formValues[field].value;
            const emailRegex = /\S+@\S+\.\S+/;
            formNewValues[field].error = false;
            if (!value || value === "" || (field === "email" && !emailRegex.test(value))) {
                formNewValues = {
                    ...formNewValues,
                    [field]: {
                        ...formNewValues[field],
                        error: true
                    }
                };
                setFormValues(formNewValues);
                return;
            }
        }

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name: formValues.name.value, email: formValues.email.value })
        })
        .then((response) => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(response.status);
            }
        })
        .then((data) => {
            props.setUser(formValues.name.value);
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
                <TextField 
                    variant="outlined" 
                    type="text" 
                    label="name" 
                    name="name" 
                    id="name" 
                    placeholder="Enter your name" 
                    value={formValues.name.value} 
                    error={formValues.name.error}
                    helperText={formValues.name.error ? formValues.name.errorMessage : ""}
                    onChange={handleChange} />
                <br />
                <TextField 
                    variant="outlined" 
                    type="text" 
                    label="email" 
                    name="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    value={formValues.email.value} 
                    error={formValues.email.error}
                    helperText={formValues.email.error ? formValues.email.errorMessage : ""}
                    onChange={handleChange} />
                <br />
                <Button variant="contained" type="submit" onClick={handleSubmit}>Login</Button>
            </Box>
        </div>
    );
};

export default Login;