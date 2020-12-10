// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonForm} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {error};
  }

  // componentDidCatch(error, info) {
  //   console.log('error', error);
  //   console.log('info', info);
  // }

  render() {
    const {error} = this.state
    // console.log('ErrorBoundary', this.state.error);
    if (error) {
      //  You can render any custom fallback UI
      return <this.props.FallbackComponent error={error}/>
    }
    return this.props.children; // return the children when there's no error
  }
}

function ErrorFallback({error}) {
  return (
        <div role="alert">There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre></div>
      )
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [{status, pokemon, error}, setState] = React.useState({status:'idle', pokemon: null, error: null});

  React.useEffect(()=>{
    if (!pokemonName) return;
    setState({status:'pending'});
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status:'resolved', pokemon}) //the Pokemonview component needs this data before the state can be set to resolved otherwise it will try to re-render without any data
      },
      error => {
        setState({status: 'rejected', error}) // this will trigger a re-render and go to the switch statements, which react then works its way up in the component tree to the closest ErrorBoundary. Once inside of it, it will set its error state via getDerivedStateFromError
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

  return (
    <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary FallbackComponent={ErrorFallback}key={pokemonName}>
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
