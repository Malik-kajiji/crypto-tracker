import { configureStore } from '@reduxjs/toolkit';
import { CryptoApi } from '../redux/CryptoApi';
import { GeckoApi } from '../redux/GeckoApi';
import { NewsApi } from '../redux/NewsApi';
import { ExchangeApi } from '../redux/ExchangeApi'; 
import { Theme } from '../redux/Theme';
import { alertController } from '../redux/AlertController';
import { User } from '../redux/User';
import { WatchList } from '../redux/WatchList';
import { TopHoldersApi } from '../redux/TopHoldersApi';

export const store = configureStore({
    reducer:{
        [CryptoApi.reducerPath] : CryptoApi.reducer,
        [GeckoApi.reducerPath]: GeckoApi.reducer,
        [NewsApi.reducerPath]: NewsApi.reducer,
        [ExchangeApi.reducerPath]: ExchangeApi.reducer,
        [TopHoldersApi.reducerPath]: TopHoldersApi.reducer,
        [Theme.name]:Theme.reducer,
        [alertController.name]:alertController.reducer,
        [User.name]:User.reducer,
        [WatchList.name]:WatchList.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(CryptoApi.middleware)
    .concat(GeckoApi.middleware)
    .concat(NewsApi.middleware)
    .concat(ExchangeApi.middleware)
    .concat(TopHoldersApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>
