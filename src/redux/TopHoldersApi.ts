import { fetchBaseQuery,createApi } from '@reduxjs/toolkit/query/react';

const requestHeaders = {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'cryptocurrency-markets.p.rapidapi.com',
};

const BaseURL = 'https://cryptocurrency-markets.p.rapidapi.com/coin';

const createRapidRequest = (url:string) => ({url,headers:requestHeaders});

export const TopHoldersApi = createApi({
    reducerPath:'topHoldersApi',
    baseQuery:fetchBaseQuery({baseUrl:BaseURL}),
    endpoints:(builder)=>({
        getTopHolder:builder.query({
            query:(currency)=>createRapidRequest(`holders?key=${currency}`)
        })
    })
})

export const { useGetTopHolderQuery } = TopHoldersApi