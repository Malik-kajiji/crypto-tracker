/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useState,useEffect } from 'react';
import '../styles/Exchange.scss';
import { IoIosArrowDropdown } from 'react-icons/io';
import { cryptoList,currencyList } from '../suggestions';
import { useGetExchangeQuery } from '../redux/ExchangeApi';

type ListType = {
        name: string;
        symbol: string;
    }[]



const Exchange = () => {
    // to handle showing the to and from Suggestions
    const [showSuggestions1,setShowSuggestions1] = useState(false);
    const [showSuggestions2,setShowSuggestions2] = useState(false);
    // to set the to and from exchanges
    const [exchange1,setExchange1] = useState('choose here');
    const [exchange2,setExchange2] = useState('choose here');
    // to choose the type of the exchange
    const [choosenExchange,setChoosenExchange] = useState(0);
    // from value
    const [inputValue,setInputValue] = useState< number | string >('');
    // to handle changing input value and make it accept only numbers
    function handleInputValue(e:React.ChangeEvent<HTMLInputElement>):void{
        const lastChar = parseFloat(e.target.value[e.target.value.length-1])
        if(e.target.value === ''){
            setInputValue('')
        } else if(Number.isNaN(lastChar)){
            if(e.target.value[e.target.value.length-1] === '.') setInputValue(e.target.value)
        }else if(typeof lastChar == 'number'){
            setInputValue(e.target.value)
        }
    }
    // to show all the possible options
    const [suggestions1 , setSuggestions1] = useState(cryptoList);
    const [suggestions2 , setSuggestions2] = useState(cryptoList);
    // suggestions inputs
    const [suggestionsInput1,setSuggestionsInput1] = useState('')
    const [suggestionsInput2,setSuggestionsInput2] = useState('')
    // to show the result value
    const [result,setResult] = useState(0);
    // to handle the suggestions for the from 
    function handleChange1(e:React.ChangeEvent<HTMLInputElement>): void {
        setSuggestionsInput1(e.target.value)
        if(e.target.value === '') {
            if(choosenExchange === 0 || choosenExchange === 1){
                setSuggestions1(cryptoList)
            }else {
                setSuggestions1(currencyList)
            }
        }
        setSuggestions1(prev => prev.filter((item):boolean => {
            let lowerName = item.name.toLowerCase();
            let lowerSymbol = item.symbol.toLowerCase();
            let search = e.target.value.toLowerCase();
            if(lowerName.includes(search) || lowerSymbol.includes(search)){
                return true
            }
            return false
        }))
    }
    // to handle the suggestions for the to 
    function handleChange2(e:React.ChangeEvent<HTMLInputElement>): void {
        setSuggestionsInput2(e.target.value)
        if(e.target.value === '') {
            if(choosenExchange === 0 || choosenExchange === 2){
                setSuggestions2(cryptoList)
            }else {
                setSuggestions2(currencyList)
            }
        }
        setSuggestions2(prev => prev.filter((item) => {
            let lowerName = item.name.toLowerCase();
            let lowerSymbol = item.symbol.toLowerCase();
            let search = e.target.value.toLowerCase();
            if(lowerName.includes(search) || lowerSymbol.includes(search)){
                return true
            }
            return false
        }))
    }
    // to reset every thing when changing the convert type
    function handleChangeType(sugges1:ListType,sugges2:ListType,choosenNum:number):void{
        setSuggestionsInput1('')
        setSuggestionsInput2('')
        setExchange1('choose here')
        setExchange2('choose here')
        setResult(0)
        setInputValue('')
        setSuggestions1(sugges1)
        setSuggestions2(sugges2)
        setChoosenExchange(choosenNum)
    }
    // to handle the event of changing exchanges
    const [exchangeArgs1,setExchangeArgs1] = useState({from:'',to:''});
    const [exchangeArgs2,setExchangeArgs2] = useState({from:'',to:''});
    const { data:data1 , isFetching:isFetching1 } = useGetExchangeQuery(exchangeArgs1)
    const { data:data2 , isFetching:isFetching2 } = useGetExchangeQuery(exchangeArgs2)
    useEffect(()=>{
        if(exchange1 !== 'choose here' && exchange2 !== 'choose here'){
            if(choosenExchange === 0){
                setExchangeArgs1({from:exchange1,to:'usd'})
                setExchangeArgs2({from:exchange2,to:'usd'})
            } else if(choosenExchange === 1){
                setExchangeArgs1({from:exchange1,to:exchange2})
            } else if(choosenExchange === 2){
                setExchangeArgs1({from:exchange2,to:exchange1})
            }
        }
    },[exchange1,exchange2])
    // to set the result depending on the changing of the input
    useEffect(()=>{
        if(!isFetching1 && !isFetching2 && exchange1 !== 'choose here' && exchange2 !== 'choose here'){
            if(choosenExchange === 0){
                const firstCurrency = parseInt(data1['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                const secondCurrency = parseInt(data2['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                let parsedValue;
                if(inputValue === '') {
                    setResult(0)
                } else {
                    typeof inputValue == 'string'? parsedValue = parseFloat(inputValue) : parsedValue = inputValue
                    const result = firstCurrency/secondCurrency * parsedValue;
                    setResult(result)
                }
            } else if(choosenExchange === 1){
                const currencyPrice = parseInt(data1['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                let parsedValue;
                if(inputValue === '') {
                    setResult(0)
                } else {
                    typeof inputValue == 'string'? parsedValue = parseFloat(inputValue) : parsedValue = inputValue
                    const result = currencyPrice * parsedValue;
                    setResult(result)
                }
            } else if(choosenExchange === 2){
                const currencyPrice = parseInt(data1['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                let parsedValue;
                if(inputValue === '') {
                    setResult(0)
                } else {
                    typeof inputValue == 'string'? parsedValue = parseFloat(inputValue) : parsedValue = inputValue
                    const result = parsedValue / currencyPrice;
                    setResult(result)
                }
            }
        }
    },[isFetching1,isFetching2,inputValue])


    return (
        <section className='container'>
            <h2 className='exchange-heading TXT-heading'>exchange rate</h2>
            <article className='exchange'>
                <div className='from'>
                    <div className='name' onClick={()=>setShowSuggestions1(prev => !prev)}>
                        <p className='TXT-heading3'> {exchange1} </p>
                        <span 
                            className={`TXT-heading3 ${showSuggestions1?'active':''}`}
                            >{IoIosArrowDropdown({})}
                        </span>
                    </div>
                        <input type="text" placeholder='search' className={`TXT-normal suggestionsInput ${showSuggestions1?'showen':''}`} 
                            onChange={(e)=>handleChange1(e)}
                            value={suggestionsInput1}
                        />
                        <ul role='list' className={`suggestions ${showSuggestions1?'showen':''}`}>
                            {suggestions1.map((e,i)=> <li 
                            key={i} 
                            className='TXT-normal'
                            onClick={()=>{
                                setExchange1(e.symbol)
                                setShowSuggestions1(false)
                            }}
                            >{e.symbol}</li>)}
                        </ul>
                    <div className='value'>
                        <input type="text" className='TXT-heading3' value={inputValue} onChange={(e)=>handleInputValue(e)} />
                    </div>
                </div>
                <span className='equal TXT-heading'> = </span>
                <div className='to'>
                <div className='name' onClick={()=>setShowSuggestions2(prev => !prev)}>
                    <p className='TXT-heading3'> {exchange2} </p>
                    <span 
                        className={`TXT-heading3 ${showSuggestions2?'active':''}`}
                        >{IoIosArrowDropdown({})}
                    </span>
                </div>
                    <input type="text" placeholder='search' className={`TXT-normal suggestionsInput ${showSuggestions2?'showen':''}`} 
                        onChange={(e)=>handleChange2(e)}
                        value={suggestionsInput2}
                    />
                    <ul role='list' className={`suggestions ${showSuggestions2?'showen':''}`}>
                        {suggestions2.map((e,i)=> <li 
                            key={i} 
                            className='TXT-normal'
                            onClick={()=>{
                                setExchange2(e.symbol)
                                setShowSuggestions2(false)
                            }}
                            >{e.symbol}</li>)}
                    </ul>
                    <div className='value'>
                        <p className='TXT-heading3'>{result}</p>
                    </div>
                </div>
            </article>
            <div className='Btns'>
                <button 
                    className={`BTN ${choosenExchange === 0?'active':''}`}
                    onClick={()=> handleChangeType(cryptoList,cryptoList,0)}
                >Crypto To Crypto</button>
                <button 
                    className={`BTN ${choosenExchange === 1?'active':''}`}
                    onClick={()=> handleChangeType(cryptoList,currencyList,1)}
                >Crypto To Currency
                </button>
                <button 
                    className={`BTN ${choosenExchange === 2?'active':''}`}
                    onClick={()=> handleChangeType(currencyList,cryptoList,2)}
                >Currency To Crypto
                </button>
            </div>
        </section>
    )
}

export default Exchange