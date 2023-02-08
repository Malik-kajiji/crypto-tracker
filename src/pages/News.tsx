import React, { useEffect, useState } from 'react'
import '../styles/News.scss';
import { useGetCryptoNewsQuery } from '../redux/NewsApi';
import Loading from '../components/Loading';

const News = () => {
    const { data , isFetching } = useGetCryptoNewsQuery({category:'crypto',count:'20'})
    const [newsArray,setNewsArray ] = useState([{datePublished:'',name:'',url:'',providerLogo:'',newsImage:''}])
    useEffect(()=>{
        if(!isFetching){
            let items = data.value
            let newArray = []
            for(let i=0; i< items.length ; i++){
                let dateDifference = new Date().getTime()-new Date(items[i].datePublished).getTime()
                let datePublished;
                if(dateDifference < (1000 * 60 * 60)){
                    datePublished = `${Math.round(dateDifference/(1000*60))} min ago`
                } else {
                    datePublished = `${Math.round(dateDifference/(1000*60*60))} hour ago`
                }
                const name = items[i].name
                const url = items[i].url
                const newsImage = items[i].image?.thumbnail?.contentUrl
                const providerLogo = items[i].provider[0].image?.thumbnail?.contentUrl || ''
                newArray.push({datePublished,name,url,providerLogo,newsImage})
            }
            setNewsArray(newArray)
        }
    },[isFetching,data])
    
    if(isFetching) return <Loading />
    return (
        <section className='container'>
            <h2 className='news-heading TXT-heading'> Latest Crypto News </h2>
            <div className='news-holder'>
                {
                newsArray.map((item,i)=><article className='card' key={i}>
                    <div className='image' style={{backgroundImage:`url('${item.newsImage}')`}}></div>
                    <p className='description TXT-normal'>
                        {item.name}
                    </p>
                    <time className='TXT-normal'> {item.datePublished}</time>
                    {item.providerLogo === ''?
                        <div className='provider-logo'></div>
                    :
                        <img src={item.providerLogo} alt=''/>
                    }
                    <a href={item.url} target='_blank' rel="noreferrer">
                        <button className='BTN'>Show more</button>
                    </a>
                </article>)
                }
            </div>
        </section>
    )
}

export default News