// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';

function Board({onClick, squares}) {
  // 🐨 squares is the state for this component. Add useState for squares
  // 0.need to serialize stored array? YES
  // 1.retrieve prev game state from localStorage using lazyInitializer
  // 2.store the game state in localStorage using useEffect and set dependency list. Do we need to return a cleanup function?

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
    // EC3
    // create a history state as an array
    // each state is stored as an array item
    // store each copy of the state inside the history item
    // need to display this
    const [currentStep, setCurrentStep] = useLocalStorageState('tic-tac-toe:step', 0);
    // const [history, setHistory] = React.useState(() => JSON.parse(localStorage.getItem('history')) || [Array(9).fill(null)]);
    const [history, setHistory] = useLocalStorageState('tic-tact-toe:history', [Array(9).fill(null)]);
    const currentSquares = history[currentStep]; // get the current board from history

    // React.useEffect(() => {
    //   localStorage.setItem('history', JSON.stringify(history));
    // },[currentSquares, history]);

    // 🐨 We'll need the following bits of derived state:
    // - nextValue ('X' or 'O')
    const nextValue = calculateNextValue(currentSquares);
    // - winner ('X', 'O', or null)
    const winner = calculateWinner(currentSquares);
    // - status (`Winner: ${winner}`, `Scratch: Cat's game`, or `Next player: ${nextValue}`)
    const status = calculateStatus(winner, currentSquares, nextValue);
    // 💰 I've written the calculations for you! So you can use my utilities
    // below to create these variables

    // This is the function your square click handler will call. `square` should
    // be an index. So if they click the center square, this will be `4`.
    function selectSquare(square) {
      // 🐨 first, if there's already winner or there's already a value at the
      // given square index (like someone clicked a square that's already been
      // clicked), then return early so we don't make any state changes
      //
      if (winner || currentSquares[square]) {
        return;
      }

      const newHistory = history.slice(0, currentStep + 1); // why + 1? cause Array.slice does not include the end!!
      const squaresCopy = [...currentSquares];
      squaresCopy[square] = nextValue;
      setHistory([...newHistory, squaresCopy]);
      setCurrentStep(newHistory.length) // currentStep index is zero based, if we use history, it will be history.length - 1

    }

    function restart() {
      // 🐨 reset the squares
      setHistory([Array(9).fill(null)]);
      setCurrentStep(0);
    }

    function selectMove(i) {
      // const newSquares = [...history[i]]
      // setCurrentSquares(newSquares);
    }

    const moves = history.map((stepSquares, step) => {
      const desc = step === 0 ? 'Go to game start' : `Go to move #${step}`
      const isCurrentStep = step === currentStep;
      return <li key={step}><button onClick={() => setCurrentStep(step)} disabled={isCurrentStep}>{desc} {isCurrentStep ? '(current)': null}</button></li>
    });

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares}/>
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  // these are the possible winning combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
