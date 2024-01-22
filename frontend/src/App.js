import logo from './logo.svg';
import {useState} from "react"
import './App.css';

function App() {
  // const [words, setWords] = useState([])
  //
  // fetch('http://words.com/api/words').then(resp => resp.json()).then((resp)=>{
  //   setWords(resp)
  // })
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
    </div>
  );
}

export default App;
