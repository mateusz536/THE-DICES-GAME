import React, { useState, Fragment, useEffect } from 'react';
import Game from './game'
import Prime from './prime'
import './styles.css'





function App() {
  const [gameStarted, toggleGameStarted] = useState(false)
  const [identity, setIdentity] = useState({player: 0, id:''})



  return (
    <div className='Main'>
      {gameStarted ?
      (<Game 
        identity={identity}

      />)
      : 
      (<Prime
        toggleGameStarted={toggleGameStarted} 
        setIdentity={setIdentity}
      />)}
    </div>
  );
}

export default App;
