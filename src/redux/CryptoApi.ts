import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const CryptoApiHeaders = {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
}

const BaseURL = 'https://coinranking1.p.rapidapi.com';

const createRapidRequest = (url:string) => ({url,headers:CryptoApiHeaders})


export const CryptoApi = createApi({
    reducerPath:'cryptoApi',
    baseQuery: fetchBaseQuery({baseUrl:BaseURL}),
    endpoints:(builder) => ({
        getCryptoCoins: builder.query({
            query:() => createRapidRequest('coins')
        })
    })
})

export const { useGetCryptoCoinsQuery } = CryptoApi;
