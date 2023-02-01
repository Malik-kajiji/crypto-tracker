import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/Coin.scss';
import { useGetCoinDataQuery } from '../redux/GeckoApi';
import Loading from '../components/Loading';
import CoinChart from '../components/CoinChart';
import { useDispatch,useSelector } from 'react-redux';
import { alertActions } from '../redux/AlertController';
import type { RootState } from '../config/store';
import { doc,setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Coin = () => {
    const { name } = useParams()
    const { data , isFetching} = useGetCoinDataQuery(name)
    const [chosenBtn , setChosenBtn] = useState(0);
    const watchList = useSelector((state:RootState) => state.watchList);
    const isLoggedIn = useSelector((state:RootState) => state.user.isLoggedIn);
    const uid = useSelector((state:RootState) => state.user.uid);
    const dispatch = useDispatch();
    let isCoinAdded:boolean = false;
    if(watchList.isEmpty){
        isCoinAdded = false
    } else {
        isCoinAdded = watchList.coinsId.coin.filter(coin => coin === name).length !== 0;
    }
    const [ coinData , setCoinData] = useState({ change:0, description:'', iconUrl:'' , name:'' , price:0 });
    let time = '24h'
    let changePercentage = 'price_change_percentage_24h'
    if(chosenBtn === 1) {
        time = '30d'
        changePercentage = 'price_change_percentage_30d'
    }else if(chosenBtn === 2) {
        time = '1y'
        changePercentage = 'price_change_percentage_1y'
    }
    function handleClick() {
        if(!isLoggedIn){
            dispatch(alertActions.showAlert({msg:'you must login to access this feature', type:'warrning', showen:true}))
        } else {
            const coinRef = doc(db,'watchlist', uid)
            if(isCoinAdded){
                const newCoins = watchList.coinsId.coin.filter(coin => coin !== name)
                setDoc(coinRef,{coin:[...newCoins]})
                .then(()=> dispatch(alertActions.showAlert({msg:'coin have been removed successfully', type:'success', showen:true})))
                .catch((err)=> dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true})))
            } else {
                setDoc(coinRef,{coin:[...watchList.coinsId.coin,name]})
                .then(()=> dispatch(alertActions.showAlert({msg:'coin have been added successfully', type:'success', showen:true})))
                .catch((err)=> dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true})))
            }
        }
    }


    useEffect(()=>{
        if(!isFetching){
            const FetchedData: {
                change:number, 
                description:string, 
                iconUrl:string, 
                name:string, 
                price:number
            } = {
                change: data.market_data[changePercentage], 
                description: data.description.en, 
                iconUrl: data.image.large , 
                name: data.name , 
                price: data.market_data.current_price.usd
            }
            setCoinData(FetchedData)
        }
    },[isFetching,data,changePercentage])

    if(isFetching) return <Loading />
    return (
        <section className='container'>
            <header>
                <img src={coinData.iconUrl} alt="" />
                <div className='info'>
                    <h2 className='TXT-heading2'>{coinData.name}</h2>
                    {coinData.change < 0?
                        <p className='TXT-heading3' style={{color:'#D63031'}}>{coinData.change}%</p>
                        :
                        <p className='TXT-heading3' style={{color:'#00B894'}}>+{coinData.change}%</p>
                    }
                </div>
                <button className={`BTN ${isCoinAdded?'redBtn':''}`} onClick={handleClick}>
                    {isCoinAdded?'remove from watch list':'add to watch list'}
                </button>
            </header>
            <CoinChart coinName={coinData.name.toLowerCase()} timePeriod={time} />
            <div className='chart-btns'>
                <button className={`BTN ${chosenBtn === 0?'active':''}`}
                    onClick={()=>setChosenBtn(0)}
                >last 24h</button>
                <button className={`BTN ${chosenBtn === 1?'active':''}`}
                    onClick={()=>setChosenBtn(1)}
                >last month</button>
                <button className={`BTN ${chosenBtn === 2?'active':''}`}
                    onClick={()=>setChosenBtn(2)}
                >last year</button>
            </div>
            <article className='text TXT-normal' dangerouslySetInnerHTML={{__html:coinData.description}}></article>
        </section>
    )
}

export default Coin