// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonForm} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(null);
  const [state, setState] = React.useState('idle');

  React.useEffect(()=>{
    if (!pokemonName) return;
    //setPokemon(null); // reset state to show loading screen
    //setFetchError(null); // reset error state to show loading screen
    setState('pending');
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon(pokemonData) //the Pokemonview component needs this data before the state can be set to resolved otherwise it will try to re-render without any data
        setState('resolved');
      }
    ).catch(error => {
      setState('rejected');
      setFetchError(error);
    });
  },[pokemonName])


  switch (state) {
    case 'rejected':
      return <div role="alert">There was an error: <pre style={{whiteSpace: 'normal'}}>{fetchError.message}</pre></div>
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible');
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
