import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const makeApiRequest = () => {
    axios.get("/api/testwithCurrentUser");
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to DEV
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={makeApiRequest}>Make api request</button>
    </div>
  );
}

export default App;
