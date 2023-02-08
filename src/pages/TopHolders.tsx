
import React, { useEffect , useState } from 'react';
import { useGetTopHolderQuery } from '../redux/TopHoldersApi';
import { useGetCoinDataQuery } from '../redux/GeckoApi';
import { IoIosArrowDropdown } from 'react-icons/io';
import { topHolderSuggs } from '../suggestions';
import '../styles/TopHolders.scss';
import Error from '../components/Error';

const TopHolders = () => {
    const [showSuggestions,setShowSuggestions] = useState(false);
    const [currency,setCurrency] = useState({name:'choose here',symbol:'',image:'',id:''});
    const [inputValue,setInputValue] = useState('');
    const [TopHoldersData , setTopHoldersData ] = useState([{address:'',balance:0,share:0}])
    const [suggestions,setSuggestions] = useState(topHolderSuggs);
    const [showenHolders,setShowenHolders] = useState(10)
    function handleClick(){
        setShowenHolders((prev) => {
            if(prev < 100) return prev + 15
            return prev
        })
    }
    useEffect(()=>{
        setSuggestions(()=>topHolderSuggs.filter((sugg)=> sugg.name.includes(inputValue) || sugg.symbol.includes(inputValue)))
    },[inputValue])
    const { isFetching:isFetching1 ,data:topHolders ,isError:isError1 } = useGetTopHolderQuery(currency.name);
    const { isFetching:isFetching2 ,data:currencyData,isError:isError2  } = useGetCoinDataQuery(currency.id);
    useEffect(()=>{
        if(!isFetching1 && topHolders.result){
            setTopHoldersData(topHolders.result.slice(0,showenHolders))
        }
    },[isFetching1,showenHolders])
    if(currency.name !== 'choose here'){
        if(isError1 || isError2 ) return <Error />
    }
    return (
        <section className='container'>
            <h2 className='holders-heading TXT-heading'>Top Holders</h2>
            <form>
                <div className='choosen-coin' onClick={()=>setShowSuggestions(prev => !prev)}>
                    <p className='TXT-heading3'>{currency.name}</p>
                    <span className={`TXT-heading3 ${showSuggestions?'active':''}`}>{IoIosArrowDropdown({})}</span>
                    {currency.image === ''?
                        ''
                    :
                        <img src={currency.image} alt="" />
                    }
                </div>
                <input className={`search TXT-normal ${showSuggestions?'active':''}`} placeholder='search' type="text"  value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
                <ul role={'list'} className={`${showSuggestions?'active':''}`}>
                    {
                        suggestions.map((e,i)=>{
                            return(
                                <li className='TXT-normal' key={i} 
                                onClick={()=>{
                                    setCurrency(e)
                                    setShowSuggestions(false)
                                }}>
                                    <p>
                                        {e.name}
                                    </p>
                                    <img src={e.image} alt="" />
                                </li>
                            )
                        })
                    }
                </ul>
            </form>
            {currency.name === 'choose here' ?
                <h2 className='TXT-heading2 not-chosen'>choose a specific cryptocurrency</h2>
                :
                isFetching1 || isFetching2 ?
                    <div className=' loading-holders'>
                        <span></span>
                    </div>
                :
                    <>
                        <ul role={'list'} className='top-holders'>
                            {
                                TopHoldersData.map((e,i)=>{
                                    let balance;
                                    let balanceInUsd:string | number = e.balance * currencyData.tickers[0].converted_last.usd;
                                    let address = e.address.slice(0,8) + '***************'
                                    if(e.balance > 1000000){
                                        balance = `${e.balance/6}m`
                                    }else if(e.balance > 1000000000){
                                        balance = `${e.balance/9}b`
                                    } else {
                                        balance = e.balance 
                                    }
                                    if(balanceInUsd > 1000000){
                                        balanceInUsd = `${e.balance/6}m`
                                    }else if(balanceInUsd > 1000000000){
                                        balanceInUsd = `${e.balance/9}b`
                                    } 
                                    return  (
                                        <li key={i}>
                                            <h2 className='TXT-heading2'>#{i+1}</h2>
                                            <p className='TXT-normal'>
                                                <span>address</span>
                                                <span>{address}</span>
                                            </p>
                                            <p className='TXT-normal'>
                                                <span>balance in {currency.symbol}</span>
                                                <span>{`${balance} ${currency.symbol}`}</span>
                                            </p>
                                            <p className='TXT-normal'>
                                                <span>balance in usd</span>
                                                <span>${balanceInUsd} </span>
                                            </p>
                                            <p className='TXT-normal'>
                                                <span>share percentage</span>
                                                <span>{e.share}%</span>
                                            </p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {showenHolders === 100?
                            ''
                            :
                            <button disabled={showenHolders === 100} className='BTN show-more' onClick={handleClick}>
                                show more
                            </button>
                        }
                    </>
            }
        </section>
    )
}

export default TopHolders