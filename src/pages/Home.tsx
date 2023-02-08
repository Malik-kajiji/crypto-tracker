import React, { useEffect, useState } from 'react'
import '../styles/Home.scss';
import { BiSearchAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { useGetCryptoCoinsQuery } from '../redux/CryptoApi';
import { useGetCoinsListQuery } from '../redux/GeckoApi';
import Error from '../components/Error';

const Home = () => {
    // fetching the stats and coins
    const { data , isFetching ,isError:isError1 } = useGetCryptoCoinsQuery('coins');
    // defining stats
    const [stats,setStats] = useState({totalCoins:0,totalMarketCap:'0',totalExchanges:0,total24hVolume:'0'})

    const { data:coinsList , isFetching:isFetchingCoins,isError:isError2 } = useGetCoinsListQuery('')
    // definig coins
    const [coins,setCoins] = useState([{name:'',current_price:'',image:'',symbol:'',id:''}])
    // defining the number of needed bullets
    const bullets:number[] = new Array(Math.ceil(coins.length / 10)).fill(0)
    // defining the current bullet to move around the pages
    const [currentBullet,setCurrentBullet] = useState(0)
    // defining the coins the current page 
    const List = coins.slice(currentBullet * 10,(currentBullet+1) * 10);
    // input value
    const [inputValue,setInputValue] = useState('')
    // to select the current page
    function handleBullets(i:number): void {
        setCurrentBullet(i)
    }
    function handleSubmit(e:React.FormEvent<HTMLFormElement>): void {
        e.preventDefault()
        window.scrollTo(0, document.body.scrollHeight)
    }
    
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const newValue = e.target.value
        setInputValue(newValue)
        setCurrentBullet(0)
        const lowerCaseValue = newValue.toLowerCase()
        setCoins(prev => {
            if(lowerCaseValue === '') return coinsList
            let newCoins = prev.filter((e)=>{
                let name = e.name.toLowerCase()
                let symbol = e.symbol.toLowerCase()
                if(name.includes(lowerCaseValue) || symbol.includes(lowerCaseValue)){
                    return true
                } else {
                    return false
                }
            })
            return newCoins
        })
    }
    useEffect(()=>{
        if(!isFetching && !isFetchingCoins){
            setCoins(coinsList)
            setStats(data.data.stats)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isFetching,isFetchingCoins])
    if(isFetching || isFetchingCoins) return <Loading />
    if(isError1 || isError2) return <Error />
    return (
        <section className='container'>
            <article className='status'>
                <h2 className='TXT-heading2'>Crypto stats</h2>
                <p className='TXT-normal'>
                    Total currencies
                    <span className='TXT-heading3'>
                        {stats.totalCoins}
                    </span>
                </p>
                <p className='TXT-normal'>
                    Total market cap
                    <span className='TXT-heading3'>
                        {`${stats.totalMarketCap.slice(0,7)}m`}
                    </span>
                </p>
                <p className='TXT-normal'>
                    Total exchanges
                    <span className='TXT-heading3'>
                        {stats.totalExchanges}
                    </span>
                </p>
                <p className='TXT-normal'>
                    Total 24h volume
                    <span className='TXT-heading3'>
                        {`${stats.total24hVolume.slice(0,7)}m`}
                    </span>
                </p>
            </article>
            <h2 className='TXT-heading2 top-currencies'>Top Currencies</h2>
            <form className='search-form'
            onSubmit={(e)=>handleSubmit(e)}
            >
                <input type="text" 
                        className='TXT-normal'
                        onChange={(e)=>handleChange(e)}
                        value={inputValue}
                />
                <button>
                    <span className='TXT-heading3'>
                        {BiSearchAlt({})}
                    </span>
                </button>
            </form>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles*/}
            <ul className='coins' role='list'>
                {List.map((e,i)=>{
                    let { name, current_price ,image,id} = e
                return (
                    <li className='coin' key={i}>
                        <Link to={`/coin/${id}`}>
                            <img src={image} alt=''/>
                            <p className='price TXT-heading3'>{current_price}</p>
                            <p className='name TXT-normal'> {name} </p>
                        </Link>
                    </li>
                )
            })}
            </ul>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles*/}
            <ul className='bullets' role='list'>
                {
                    bullets.map((e,i)=><li
                    key={i}
                    onClick={()=>handleBullets(i)}
                    className={`TXT-heading3 ${currentBullet === i ? 'active':''}`}
                    >{i+1}</li>)
                }
            </ul>
        </section>
    )
}

export default Home