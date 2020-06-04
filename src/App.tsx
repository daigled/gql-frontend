import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState, rollDice, resetDice, DiceRoll } from './app/store/store';

import './App.css';

interface AppProps {
  message: string
  rollDice: typeof rollDice
  resetDice: typeof resetDice
}

const App: React.SFC<AppProps> = ({
  message = 'howdy',
  rollDice,
  resetDice
}) => {

  const [ dice, updateDice ] = useState([])
  const [ count, updateCount ] = useState(1)
  const [ faces, updateFaces ] = useState(6)
  const [ hasFetched, updateFetchedState ] = useState(false)

  const query = `query RollDice($count: Int!, $faces: Int) {
    rollDice(numDice: $count, numSides: $faces)
  }`

  const roll = (diceRoll: DiceRoll) => {
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: { count, faces }
      })
    })
    .then( res => res.json())
    .then( json => {
      updateDice(json.data.rollDice)
      updateFetchedState(true)
    })
  }

  const reset = () => {
    updateDice([])
  }

  /**Uncomment to roll on page load */
  // useEffect(() => {
    
  //   fetch('http://localhost:4000/graphql', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       query,
  //       variables: {count, faces}
  //     })
  //   })
  //   .then( res => res.json())
  //   .then( json => {
  //     updateDice(json.data.rollDice)
  //     updateFetchedState(true)
  //   })
  // }, [])

  return (
    <>
      <h1>{message}</h1>
      <p>we have {hasFetched ? '' : 'not'} fetched</p>
      <div>
        <p>Dice Values:</p>
        <ul>
          { dice.map((_, i) => <li key={i}>{_}</li>)}
        </ul>
      </div>
      <input type="number" value={count} onChange={ e => updateCount(parseInt(e.target.value))}/>
      <input type="number" value={faces} onChange={ e => updateFaces(parseInt(e.target.value))}/>
      <button onClick={e => roll({count, faces})}>Roll</button>
      <button onClick={e => reset()}>Reset</button>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  dice: state.dice
})

export default connect(
  mapStateToProps,
  {
    rollDice,
    resetDice
  }
)(App);
