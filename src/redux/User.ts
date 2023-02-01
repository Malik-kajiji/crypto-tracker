import { createSlice } from '@reduxjs/toolkit';

export const User = createSlice({
    name:'user',
    initialState:{
        isLoggedIn:false,
        name:'',
        email:'',
        uid:''
    },
    reducers: {
        setUserState(state,action){
            state.isLoggedIn = action.payload.isLoggedIn;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.uid = action.payload.uid
        }
    }
})

export const userAction = User.actions