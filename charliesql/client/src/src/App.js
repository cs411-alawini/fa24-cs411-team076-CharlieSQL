import React, { useState } from "react";

import "./App.css";


function App() {

  const [isInputVisible, inputVisible]=useState(false);

  const [inputValues, setInputValues]=useState({

    age: "",

    gender: "",

    country: "",

  });

  const [currQuestion, setcurrQuestion]=useState(0);


  const questions = [

    "What is your age?",

    "What is your gender?",

    "What country are you from?",

  ];


  const toggleInput =()=> {

    inputVisible(true);

  };

  const homeClick =()=> {

    inputVisible(false);

    setInputValues({ age: "", gender: "", country: ""});

    setcurrQuestion(0);

  };


  const handleInputChange =(event, question) => {

    setInputValues({...inputValues,

      [question]: event.target.value,

    });

  };

  const nextClick = () => {

    if (currQuestion < questions.length-1) {

      setcurrQuestion(currQuestion+1);

    } else {

      alert("Based on your demographics, you will probably develop diabetes!");

    }

  };


  return (

    <div className="App">

      <header className="App-header">

        <button className="home-button" onClick={homeClick}>Home</button>

        <p>DiabetesInsight</p>

      </header>

      <div className="button-container">

        {!isInputVisible && (

          <button className="start-button" onClick={toggleInput}>

            Start Here

          </button>

        )}

        {isInputVisible && currQuestion<questions.length && (

          <div className="input-container">

            <p className="question">{questions[currQuestion]}</p>

            <input

              type="text"

              value={inputValues[Object.keys(inputValues)[currQuestion]]}

              onChange={(e) => handleInputChange(e, Object.keys(inputValues)[currQuestion])}

              placeholder="Type answer here"

              className="input-box"

            />

          </div>

        )}

        {isInputVisible && (

          <button className="next-button" onClick={nextClick}>Next</button>

        )}

      </div>

    </div>

  );

}

export default App;



