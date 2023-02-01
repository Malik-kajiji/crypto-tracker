import React from 'react'

const Loading = () => {
    const divs:number[] = [0, 0.1 , 0.2 , 0.3 , 0.4 , 0.5, 0.6 , 0.7 , 0.8]
    return (
        <article className='loading'>
            {divs.map(num => <div key={num} style ={{animationDelay:`${num}s`}}></div>)}
        </article>
    )
}

export default Loading