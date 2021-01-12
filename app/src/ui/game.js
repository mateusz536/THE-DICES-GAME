import React, { useState,  useEffect } from 'react';
import dice1 from '../materials/dice1.png'
import dice2 from '../materials/dice2.png'
import dice3 from '../materials/dice3.png'
import dice4 from '../materials/dice4.png'
import dice5 from '../materials/dice5.png'
import dice6 from '../materials/dice6.png'
import {v4 as uuidv4} from 'uuid'
import {Button} from '@material-ui/core'
import BasicTable from './table'
import Axios from 'axios'
import Gamelobby from './gamelobby'

const wzor = require('./jsonwzor')
const jsonik = wzor.jsonik;
const player_state = wzor.player_state;
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:8000/mqtt');




function Game({identity}) {
    
    const [gameState, setGameState] = useState({ started: false, state: [], dices_state:[]})
    const [currDices, setCurrDices] = useState([
        {value:1, clicked: false},
        {value:2, clicked: false},
        {value:3, clicked: false},
        {value:4, clicked: false},
        {value:5, clicked: false}])
    const [clicked, setClicked] = useState([])
    
    useEffect(() => {
        client.on('connect', () => {
        console.log('connected to broker')
    })
    client.subscribe(`game/${identity[0]}`);
    client.subscribe(`game/${identity[0]}/chat`)
    
    client.on('message', function (topic, message) {
        let resp = JSON.parse(message.toString());
        console.log(resp, 'zmiana stanu else')
        setGameState(resp)
        setCurrDices(resp.dices_state)
        console.log(gameState)
        // setCurrDices(resp.dices_state)  
            }
        );
    },[])
    
    
    async function send_game_state_when_rerolled() {
        let ns = gameState;
        ns.clicked_dices = clicked
        try {
            await Axios({
            method: "post",
            url: `http://localhost:3210/game/${identity[0]}/reroll`,
            data: ns
          });
          console.log('gamestate sent', gameState)
        } catch (error) {
          console.error(error);
        }
      }


    async function send_game_state_when_chosen() {
        try {
            await Axios({
            method: "post",
            url: `http://localhost:3210/game/${identity[0]}`,
            data: gameState
          });
          console.log('gamestate sent', gameState)
        } catch (error) {
          console.error(error);
        }
      }
    


    const isMove = () => {
        return (identity[1] == gameState.move) ? true : false
    }

    const dices = {
        1: dice1,
        2: dice2,
        3: dice3,
        4: dice4,
        5: dice5,
        6: dice6
    }
    
    

    const reroll = () => {
        if (gameState.rerolls < 3) {
        send_game_state_when_rerolled();
        }
    }

    const startGame = async () => {
        try {
            const response = await Axios({
            method: "get",
            url: `http://localhost:3210/game/${identity[0]}/start`,
          });
          
        } catch (error) {
          console.error(error);
        }
    }

    const generateBorderWhenClicked = (ids,dice) => {
        dice.clicked = !dice.clicked;
        if (document.getElementById(ids).style.border === 'none') {
            document.getElementById(ids).style.border = 'black solid 1px'
        } else {
            document.getElementById(ids).style.border = 'none'
        }
        

        console.log(clicked)
    }


    return (
        <div> 
            {console.log(gameState)}
            {gameState.started ?
                <div className="game">
                    <h3>You are player {identity[1]}</h3>
                    <h2>It's player's {gameState.move} move</h2>
                    {(gameState.move === identity[1])
                    ?
                    <Button onClick={reroll} variant="contained" color="secondary">{(gameState.dices_state.length === 0) ? "THROW DICES" : "REROLL"}</Button>
                    :
                    <div></div>
                     }
                    
                    <div className='display'>
                    
                        {gameState.dices_state.map(dice => {
                            let ids=uuidv4()
                        return (
                            
                            <img key={ids} id={ids} style={(dice.clicked==true)? {border: 'black solid 2px'} : {border: 'none'}} className='dice' onClick={() => { generateBorderWhenClicked(ids,dice)}} src={dices[dice.value]}/>
                        )})}
                    </div>
                    <div className='table'>
                        {gameState.state.map(st => {
                            let id1 = uuidv4()
                            return (
                                <div key={id1} className='kupa' className='ptable'><BasicTable currentMove={gameState.move} gameid={identity[0]} playerid={st.player} dices={gameState.dices_state} points={st.points}/></div>
                            )
                        })}
                        
                    </div>
                </div>: <Gamelobby id={identity[0]} connectedplayers={gameState.state.length}/> 
                
                }   
    </div>
    )
}
export default Game;