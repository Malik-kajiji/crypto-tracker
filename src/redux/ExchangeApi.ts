import { createApi , fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const requestHeaders = {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
};

const BaseURL = 'https://alpha-vantage.p.rapidapi.com';

const createRapidRequest = (url:string) => ({url,headers:requestHeaders})

export const ExchangeApi = createApi({
    reducerPath:'exchangeApi',
    baseQuery:fetchBaseQuery({baseUrl:BaseURL}),
    endpoints:(builder)=>({
        getExchange: builder.query({
            query:({from,to})=>createRapidRequest(`/query?from_currency=${from}&function=CURRENCY_EXCHANGE_RATE&to_currency=${to}`)
        })
    })
})

export const { useGetExchangeQuery } = ExchangeApi