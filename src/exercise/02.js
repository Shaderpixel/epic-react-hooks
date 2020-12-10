// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// options (third argument) defaults to an empty object
function useLocalStorageState(key, defaultValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse
} = {}) {
  const [state, setState] = React.useState(() => {
    const localStorageVal = window.localStorage.getItem(key);
    if (localStorageVal) {
      return deserialize(window.localStorage.getItem(key));
    }
    // if defaultvalue is an expensive function that needs to be evaluated during lazy initializing in intiial call
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }) // using lazy intializer so that localStorage is only accessed once on initial render

  //if key name changes
  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    // key could have changed but useEffect did not trigger recently to update the localStorage
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) window.localStorage.removeItem('prevKey');
    prevKeyRef.current = key;

    window.localStorage.setItem(key, serialize(state));
  },[key, serialize, state]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name' ,initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name}/>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
