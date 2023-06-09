import React from 'react';
import { useState } from 'react';
import '../styles/App.css';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

const App = () => {

  const API =  "https://frontend-take-home-service.fetch.com";
  const [user, setUser] = useState("");

  const logout = () => {
    fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    setUser("");
  };

  return (
    <div className="App">
      <Header user={user} logout={logout} text="Dog Fetcher" />
      <Body user={user} setUser={setUser} API={API} />
      <Footer text = "© 2023 by Jared Bears" />
    </div>
  );
};

export default App;