import React from 'react';
import '../styles/App.css';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

const App = () => {

  const API =  "https://frontend-take-home-service.fetch.com";

  return (
    <div className="App">
      <Header text="Dog Fetcher" />
      <Body API={API} />
      <Footer text = "© 2023 by Jared Bears" />
    </div>
  );
};

export default App;