import { createSlice } from '@reduxjs/toolkit';


export const WatchList = createSlice({
    name:'watchList',
    initialState:{
        coinsId:{coin:[]},
        isEmpty:true
    },
    reducers: {
        setAll(state,action){
            state.coinsId = action.payload.coins
            state.isEmpty = action.payload.isEmpty
        }
    }
})

export const WatchListActions = WatchList.actions