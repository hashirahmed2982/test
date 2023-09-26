import { createContext, useReducer } from 'react'

export const TransactionsContext = createContext()

export const TransactionsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS': 
      return {
        transactions: action.payload
      }
    case 'CREATE_TRANSACTION':
      return {
        transactions: [action.payload, ...state.workouts]
      }
    case 'DELETE_TRANSACTION':
      return {
        transactions: state.workouts.filter((w) => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const TransactionsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(TransactionsReducer, {
    transactions: null
  })

  return (
    <TransactionsContext.Provider value={{...state, dispatch}}>
      { children }
    </TransactionsContext.Provider>
  )
}