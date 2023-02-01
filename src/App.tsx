/* eslint-disable react-hooks/exhaustive-deps */
import React,{useEffect} from 'react';
import './styles/Colors.scss';
import './styles/Global.scss';
import SideBar from './components/SideBar';
import { BrowserRouter,Route , Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './config/store';
import { 
  Account , 
  Coin , 
  Home , 
  News , 
  WatchList,
  NotFound,
  Exchange
} from './pages';
import Alert from './components/Alert';
import { userAction } from './redux/User';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { WatchListActions } from './redux/WatchList';
import { doc, onSnapshot } from 'firebase/firestore';


function App() {
  const theme = useSelector((state:RootState)=> state.theme.mode);
  const uid = useSelector((state:RootState) => state.user.uid);
  const isLoggedIn = useSelector((state:RootState) => state.user.isLoggedIn);
  const dispatch = useDispatch()
  useEffect(()=>{
    if(isLoggedIn){
      const coinRef = doc(db,'watchlist', uid);
      onSnapshot(coinRef,(res)=>{
          const  coin  = res.data()
        if(res.exists()){
          if(coin?.coin.length > 0){
            dispatch(WatchListActions.setAll({coins:coin,isEmpty:false}))
          } else {
            dispatch(WatchListActions.setAll({coins:{coin:[]},isEmpty:true}))
          }
        } else {
          dispatch(WatchListActions.setAll({coins:{coin:[]},isEmpty:true}))
        }
      })
    } 
  },[isLoggedIn])
  useEffect(()=>{
    const removeStateChanged = onAuthStateChanged(auth,(user)=>{
        if(user === null) {
            dispatch(userAction.setUserState({isLoggedIn:false,name:'',email:'',uid:''}))
            dispatch(WatchListActions.setAll({coins:{coin:[]},isEmpty:true}))
        } else {
            dispatch(userAction.setUserState({isLoggedIn:true, name: user.displayName , email:user.email ,uid:user.uid}))
        }
    })
    return () => removeStateChanged()
},[])
  return (
    <BrowserRouter >
      <main className={`App ${theme === 'dark'? 'Dark':'light'}`}>
        <SideBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/news' element={<News />} />
          <Route path='/watchlist' element={<WatchList />} />
          <Route path='/exchange' element={<Exchange />} />
          <Route path='/account' element={<Account />} />
          <Route path='/coin/:name' element={<Coin />} />
          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Alert />
      </main>
    </BrowserRouter>
  );
}

export default App;
