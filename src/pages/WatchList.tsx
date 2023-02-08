import React,{useEffect, useState} from 'react';
import { useGetCoinsListQuery } from '../redux/GeckoApi';
import { useDispatch , useSelector } from 'react-redux';
import type { RootState } from '../config/store';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import '../styles/WatchList.scss';
import { doc,setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { alertActions } from '../redux/AlertController';
import Error from '../components/Error';

const WatchList = () => {
    const { data , isFetching ,isError } = useGetCoinsListQuery('')
    const watchList = useSelector((state:RootState) => state.watchList);
    const [coinsToRender,setCoinsToRender] = useState([{
        id:'',
        name:'',
        image:'',
        high_24h:0,
        current_price:0,
        low_24h:0,
        market_cap_change_24h:0,
        price_change_percentage_24h:0,
        market_cap_rank:0
    }]) 
    const dispatch = useDispatch()
    const {coinsId , isEmpty} = useSelector((state:RootState) => state.watchList);
    const uid = useSelector((state:RootState) => state.user.uid);

    useEffect(()=>{
        if(!isFetching && !isEmpty){
            let newCoins = [];
            for(let i=0 ; i < data.length ; i++){
                for(let k=0; k < coinsId.coin.length ; k++){
                    if(data[i].id === coinsId.coin[k]){
                        const {
                            id,
                            name,
                            image,
                            high_24h,
                            current_price,
                            low_24h,
                            market_cap_change_24h,
                            price_change_percentage_24h,
                            market_cap_rank
                        } = data[i]
                        newCoins.push({id,name,image,high_24h,current_price,low_24h,market_cap_change_24h,price_change_percentage_24h,market_cap_rank})
                    }
                }
            }
            setCoinsToRender(newCoins)
        }
    },[isFetching,coinsId.coin.length])

    if(isFetching)return <Loading />
    if(isError)return <Error />
    return (
        <section className='container'>
            <h2 className='WatchList-heading TXT-heading'> WatchList </h2>
        {isEmpty ? 
        <h2 className='TXT-heading2 no-coins'> looks like you need to add currencies to your watch list </h2>
        :
        <div className='coins-holder'>
            {coinsToRender.map((coin,i) => {
                const {
                    id,
                    name,
                    image,
                    low_24h,
                    high_24h,
                    current_price,
                    market_cap_rank,
                    market_cap_change_24h,
                    price_change_percentage_24h
                } = coin
                return (
                    <article className='coin-stats' key={i}>
                        <h2 className='TXT-heading2 heading-stats'>
                            <span>{name}</span>
                            <span>${current_price}</span>
                            <span>#{market_cap_rank}</span>
                        </h2>
                        <img src={image} alt="" />
                        <div className='last-24h-stats'>
                            <h2 className='TXT-heading3'>last 24h stats</h2>
                            {price_change_percentage_24h < 0?
                                <p className='TXT-normal'><span>change percentage</span>   <span style={{color:'#D63031'}}>{price_change_percentage_24h}%</span></p>
                                :
                                <p className='TXT-normal'><span>change percentage</span>   <span style={{color:'#00B894'}}>+{price_change_percentage_24h}%</span></p>
                            }
                            <p className='TXT-normal'><span >highest price</span>   <span style={{color:'#00B894'}}>${high_24h}</span></p>
                            <p className='TXT-normal'><span>lowest price </span>   <span style={{color:'#D63031'}}>${low_24h}</span></p>
                            {market_cap_change_24h < 0 ?
                                <p className='TXT-normal'><span>market cap change</span>   <span style={{color:'#D63031'}}>-${market_cap_change_24h.toString().slice(1,7)}m</span></p>
                                :
                                <p className='TXT-normal'><span>market cap change</span>   <span style={{color:'#00B894'}}>+${market_cap_change_24h.toString().slice(1,7)}m</span></p>
                            }
                        </div>
                        <div className='btns'>
                            <button className='BTN redBtn' 
                                onClick={()=>{
                                    const coinRef = doc(db,'watchlist', uid);
                                    const newCoins = watchList.coinsId.coin.filter(coin => coin !== id)
                                    setDoc(coinRef,{coin:[...newCoins]})
                                    .then(()=> dispatch(alertActions.showAlert({msg:'coin have been removed successfully', type:'success', showen:true})))
                                    .catch((err)=> dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true})))
                                }}
                            > remove </button>
                            <Link to={`/coin/${id}`}>
                                <button className='BTN'> view chart </button>
                            </Link>
                        </div>
                    </article>
                )
            })}
        </div>
        }
        </section>
    )
}

export default WatchList