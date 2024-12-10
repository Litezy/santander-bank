import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    profile: {},
    notifications: [], 
    forms:{},
    currency:null,
    usersavings:[],
    messages:[],
    active_chats:[],
    closed_chats:[],
    newCurr:null
  };
  
  export const globalStates = createSlice({
    name: 'global',
    initialState,
    reducers: {
      dispatchProfile: (state, action) => {
        state.profile = action.payload;
      },
      dispatchForms: (state, action) => {
        state.forms = action.payload;
      },
      dispatchCurrency: (state, action) => {
        state.currency = action.payload;
      },
      updateForms: (state, action) => {
        const { name, value } = action.payload;
        state.forms[name] = value;
      },
      dispatchNotifications: (state, action) => {
        state.notifications = action.payload;
      },
      dispatchUserSavings: (state, action) => {
        state.usersavings = action.payload;
      },
      dispatchMessages: (state, action) => {
        state.messages = action.payload;
      },
      dispatchActiveChats: (state, action) => {
        state.active_chats = action.payload;
      },
      dispatchClosedChats: (state, action) => {
        state.closed_chats = action.payload;
      },
      dispatchNewCurr: (state, action) => {
        state.newCurr = action.payload;
      },
    },
  });

export const { dispatchForms,dispatchNotifications,dispatchProfile,dispatchCurrency,dispatchUserSavings,dispatchMessages,dispatchActiveChats,dispatchClosedChats,dispatchNewCurr  } = globalStates.actions

export default globalStates.reducer