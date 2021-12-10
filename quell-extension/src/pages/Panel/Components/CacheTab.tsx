import React, { useMemo, useState, useEffect } from 'react';

const CacheTab = () => {
  //use state to store data from redis server
  const [ redisStats, setRedisStats ] = useState([]);
  const [ activeTab, setActiveTab] = useState('client');

  useEffect(() => {
    //  send fetch to redis route
     fetch('http://localhost:3000/redis')
     .then(response => response.json())
     .then(data => setRedisStats(data))
     .catch(error => console.log('error fetching from redis', error));
  },[])

  const genTable = (title) => {
    const output = [];
    for (let key in redisStats[title]){
      output.push(
        <div className='subStats' style={{maxWidth:'300px'}}>
          <div key={`${title}.name`} style={{border:'1px solid #555', padding:'0 12px 0 10px'}}>{redisStats[title][key].name}</div>
          <div key={`${title}.value`} style={{border:'1px solid #555', padding:'0 12px 0 10px'}}>{redisStats[title][key].value}</div>
        </div>
      )
    }
    return output;
  }

  const activeStyle = {backgroundColor:'#444'};
 
  return (
    <div className="cacheStatTab">
      <span style={{fontWeight:'bold', fontSize: '2rem'}}>Cache Server</span>

      <div className="Cache Server">
        <div className='serverTable'>
        {genTable('server')}
        </div>
        <div className='dynamicCacheTable'>
          <div className="cacheNavBar">
            {/* <button 
              className='cacheNavbutton' 
              style={activeTab==='server' ? activeStyle : {}}
              onClick={() => setActiveTab('server')}>
              Server
            </button> */}
            
            <button 
              className='cacheNavbutton'
              style={activeTab==='client' ? activeStyle: {}}
              onClick={() => setActiveTab('client')}>
              Client
            </button>
            
            <button 
              className='cacheNavbutton'
              style={activeTab==='memory' ? activeStyle: {}}
              onClick={() => setActiveTab('memory')}>
              Memory
            </button>
            
            <button 
              className='cacheNavbutton'
              style={activeTab==='stats' ? activeStyle: {}}
              onClick={() => setActiveTab('stats')}>
              Stats
            </button>
          </div>

          {activeTab === 'server' && 
            <div>
              {genTable('server')}
            </div>
          }

          {activeTab === 'client' && 
            <div>
              {genTable('client')}
            </div>
          }

          {activeTab === 'memory' && 
            <div>
              {genTable('memory')}
            </div>
          }

          {activeTab === 'stats' && 
            <div>
              {genTable('stats')}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
export default CacheTab;
