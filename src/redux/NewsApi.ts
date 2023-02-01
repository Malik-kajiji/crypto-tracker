import { createApi , fetchBaseQuery   } from '@reduxjs/toolkit/query/react';

const RapidHeaders = {
    'X-BingApis-SDK': 'true',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
}

const BaseUrl = 'https://bing-news-search1.p.rapidapi.com';

const createRapidRequest = (url:string) => ({url,headers:RapidHeaders})


export const NewsApi = createApi({
    reducerPath:'newsApi',
    baseQuery:fetchBaseQuery({baseUrl:BaseUrl}),
    endpoints:(builder)=>({
        getCryptoNews: builder.query({
            query:({category,count}) => createRapidRequest(`news/search?q=${category}&count=${count}&freshness=Day&textFormat=Raw&safeSearch=Off`)
        })
    })
})

export const { useGetCryptoNewsQuery  } = NewsApi