// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary';
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonForm} from '../pokemon'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again.</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [{status, pokemon, error}, setState] = React.useState({
    status: pokemonName ? 'pending':'idle',
    pokemon: null,
    error: null
  });

  React.useEffect(()=>{
    if (!pokemonName) return;
    setState({status:'pending'});
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status:'resolved', pokemon}) //the Pokemonview component needs this data before the state can be set to resolved otherwise it will try to re-render without any data
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  },[pokemonName])


  switch (status) {
    case 'rejected':
      // this will be handled by our error boundary
      throw error
      // return <div role="alert">There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre></div>
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

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary FallbackComponent={ErrorFallback}onReset={handleReset}>
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
