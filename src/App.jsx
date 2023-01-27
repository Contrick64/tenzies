import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [numRolls, setNumRolls] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    console.log("setState");
    return localStorage.getItem("highscore") || "";
  });

  function gameData() {
    return `tenzies: ${tenzies}, numRolls: ${numRolls}, highScore: ${highScore}`;
  }

  useEffect(() => {
    highScore && localStorage.setItem("highscore", highScore);
    console.log("setItem - " + gameData());
  }, [highScore]);
  useEffect(() => {
    tenzies &&
      (numRolls < highScore || (numRolls > 0 && !highScore)) &&
      setHighScore(numRolls);
    console.log("setHighScore - " + gameData());
  }, [tenzies]);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setNumRolls((prevNum) => prevNum + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setNumRolls(0);
    }
  }

  function holdDice(id) {
    !tenzies &&
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
        })
      );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <div className="roll-container">
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <div className="score">
          <div>
            Rolls:
            <br />
            {numRolls}
          </div>
          {highScore && (
            <div>
              Best:
              <br />
              {highScore}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
