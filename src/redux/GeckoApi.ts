import { createApi , fetchBaseQuery  } from '@reduxjs/toolkit/query/react';

const BaseURL = 'https://api.coingecko.com/api/v3/coins';
export const GeckoApi = createApi({
    reducerPath:'geckoApi',
    baseQuery:fetchBaseQuery({baseUrl:BaseURL}),
    endpoints:(builder)=>({
        getCoinData: builder.query({
            query:(name) => `${name}`
        }),
        getCoinChart: builder.query({
            query:({name,timePeriod,interval}) => `${name}/market_chart?vs_currency=usd&days=${timePeriod}&interval=${interval}`
        }),
        getCoinsList: builder.query({
            query:() => `markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
        })
    })
})

export const  { useGetCoinChartQuery,useGetCoinsListQuery,useGetCoinDataQuery } = GeckoApi