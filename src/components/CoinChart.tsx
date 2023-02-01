/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {AreaChart, XAxis , YAxis ,Tooltip , Area } from 'recharts';
import { useGetCoinChartQuery } from '../redux/GeckoApi';
type PropsType = {
    coinName: string | undefined
    timePeriod: string
}

const CoinChart = ({ coinName , timePeriod}:PropsType) => {
    let chartData;
    if(timePeriod === '24h'){
        chartData = {name:coinName,timePeriod:'1',interval:'hour'}
    }else if (timePeriod === '30d') {
        chartData = {name:coinName,timePeriod:'30',interval:'daily'}
    }else {
        chartData = {name:coinName,timePeriod:'365',interval:'monthly'}
    }
    const { data,isFetching } = useGetCoinChartQuery(chartData)


    
    const [ priceDate,setPriceData ] = useState([{'date':0,'price':0}]) 
    useEffect(()=>{
        if(!isFetching && data !== undefined){
            const newPriceData = data.prices.map((e:number[])=>{
                let date
                if(timePeriod === '24h'){
                    date = new Date(e[0]).getHours()
                    if(date > 12){
                        date = `${date - 12} PM`
                    }else {
                        date = `${date} AM`
                    }
                }else {
                    date = new Date(e[0]).toLocaleDateString()
                }
                return {'date':date,'price':e[1]}
            })
            setPriceData(newPriceData)
        }
    },[isFetching,data])

    // for chart daimintions
    const [chartStyle,setChartStyle] = useState({width:0,height:0,marginRight:0})
    function chartStyleChanger(){
        const windowWidth = window.innerWidth
        if(windowWidth >= 1130){
            setChartStyle({width:1005,height:400,marginRight:60})
        }else if(windowWidth < 1130 && windowWidth >= 900){
            setChartStyle({width:765,height:350,marginRight:60})
        }else if(windowWidth < 900 && windowWidth >= 480){
            setChartStyle({width:470,height:300,marginRight:10})
        }else if(windowWidth < 480){
            setChartStyle({width:290,height:200,marginRight:0})
        }
    }
    useEffect(()=>{
        chartStyleChanger()
        window.addEventListener('resize',()=>chartStyleChanger())
    },[])
    return (
        <div className='chart'>
            <AreaChart width={chartStyle.width} height={chartStyle.height} data={priceDate}
                margin={{ top: 0, right: chartStyle.marginRight, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#abc4ff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#edf2fb" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#abc4ff" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
        </div>
    )
}

export default CoinChart