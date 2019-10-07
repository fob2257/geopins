import React, { createContext, useReducer, useEffect } from 'react';

import Reducers, { initialState } from './reducers';

const contextLocalStorage = 'context-geopins';

// const initialState = (localStorage.getItem(contextLocalStorage)) ? JSON.parse(localStorage.getItem(contextLocalStorage))
//   : ({ ...rootReducerState });

const Context = createContext(initialState);

export default Context;

export const ContextProvider = (props) => {
  const [state, dispatch] = useReducer(Reducers, initialState);
  // console.log(state);
  // useEffect(() => {
  //   localStorage.setItem(contextLocalStorage, JSON.stringify(state));
  // }, [state]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
}
