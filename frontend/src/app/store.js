import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './reducer'


export default configureStore({
  reducer: {
    profile: profileReducer
  },
})