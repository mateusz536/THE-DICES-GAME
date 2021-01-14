import React, { useState,  useEffect } from 'react';
import dice1 from '../materials/dice1.png'
import dice2 from '../materials/dice2.png'
import dice3 from '../materials/dice3.png'
import dice4 from '../materials/dice4.png'
import dice5 from '../materials/dice5.png'
import dice6 from '../materials/dice6.png'
import {v4 as uuidv4} from 'uuid'
import {Button,TextField} from '@material-ui/core'
import BasicTable from './table'
import Axios from 'axios'
import Gamelobby from './gamelobby'


const wzor = require('./jsonwzor')
const jsonik = wzor.jsonik;
const player_state = wzor.player_state;
const mqtt = require('mqtt');
console.log('siema')
const client = mqtt.connect('mqtt://localhost:8000/mqtt');

var seconds = new Date().getTime() / 1000;


function Game({identity}) {
    const [message, setMessage] = useState('')
    const [gameState, setGameState] = useState({ started: false, state: [], dices_state:[]})
    const [chatState, setChatState] = useState([])
    const [clicked, setClicked] = useState([])
    
    useEffect(() => {
        client.on('connect', () => {
        console.log('connected to broker')
        
    })
    client.subscribe(`game/${identity[0]}`);
    client.subscribe(`game/${identity[0]}/chat`)
    client.publish(`game/${identity[0]}/chat`, JSON.stringify({player: identity[1], message: 'CONNECTED'}))
    
    client.on('message', function (topic, message) {
        if (topic === `game/${identity[0]}/chat`) {
            console.log(chatState,'chat update')
            setChatState(chatState => [...chatState,JSON.parse(message.toString())].reverse())
            
            } else {
                let resp = JSON.parse(message.toString());
                console.log(resp, 'zmiana stanu else')
                setGameState(resp)
                console.log(gameState,'chat update')
            }
        }
        );
    },[])
    
    
    async function send_game_state_when_rerolled() {
        let ns = gameState;
        ns.clicked_dices = clicked;
        ns.activity = 4;
        try {
            await Axios({
            method: "post",
            url: `/game`,
            data: ns
          });
        } catch (error) {
          console.error(error);
        }
      }


    async function send_game_state_when_chosen() {
        try {
            await Axios({
            method: "post",
            url: `/game}`,
            data: {...gameState, activity: 5}
        });
        } catch (error) {
        console.error(error);
        }
    }
    
    const sendMessage = async () => {
        document.getElementById('chatinput').value=""
        try {
            await Axios({
            method: "post",
            url: `/chat`,
            data: {id: identity[0], player: identity[1], message: message}
        });
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

    const generateBorderWhenClicked = (ids,dice) => {
        if (identity[1] === gameState.move) {
            dice.clicked = !dice.clicked;
            if (document.getElementById(ids).style.border === 'none') {
                document.getElementById(ids).style.border = 'black solid 2px'
            } else {
                document.getElementById(ids).style.border = 'none'
            }
        }
    }


    return (
        <div> 
            {console.log(gameState)}
            {gameState.winner ? (<div style={{textAlign:'center'}}> <h1>WINNER IS PLAYER {gameState.winner}</h1></div>) 
            : <div>{gameState.started ?
                    <div className="game">
                        
                        
                        <div className='display'>
                            <div className='top'>
                                <div className='chat'>
                                    <div className='messdispl'>
                                        {chatState.slice(0,5).map(m => <p className='mess'>Player {m.player}: {m.message}</p>)}
                                    </div>
                                    <div style={{marginTop: '50px'}}>
                                        <TextField id='chatinput' label="Chat" variant="outlined" onChange={(e) => setMessage(e.target.value)}></TextField>
                                        <Button style={{marginTop: '10px', marginLeft:'5px'}}variant='contained' color='primary' onClick={() => sendMessage()}>send</Button>
                                    </div>
                                </div>
                                <div className='rolltable'>
                                    <div style={{marginTop:'180px', height:'50px'}}>
                                    {gameState.dices_state.map(dice => {
                                            let ids=uuidv4()
                                        return (
                                            
                                            <img key={ids} id={ids} style={(dice.clicked==true)? {border: 'black solid 2px'} : {border: 'none'}} className='dice' onClick={() => { generateBorderWhenClicked(ids,dice)}} src={dices[dice.value]}/>
                                        )})}
                                    </div>
                                    <div style={{marginTop:'30px'}}>
                                    {(gameState.move === identity[1])
                                        ?
                                        <Button onClick={reroll} variant="contained" color="secondary">{(gameState.dices_state.length === 0) ? "THROW DICES" : "REROLL"}</Button>
                                        :
                                        <div></div>
                                        }
                                    </div>
                                </div>
                                <div className='info'>
                                    <h3>You are player {identity[1]}</h3>
                                    <h2>It's player's {gameState.move} move</h2>
                                    
                                    
                                </div>
                            </div>
                        </div>
                            <div className='table'>
                                {gameState.state.map(st => {
                                    let id1 = uuidv4()
                                    return (
                                        <div key={id1} className='ptable'><BasicTable currentMove={gameState.move} gameid={identity[0]} playerid={identity[1]} tableid={st.player} dices={gameState.dices_state} points={st.points}/></div>
                                    )
                                })}
                                
                            </div>
                    </div>: <Gamelobby chatState={chatState} sendMessage={sendMessage} setMessage={setMessage} id={identity[0]} connectedplayers={gameState.state.length}/> 
                    
                    }   </div>
            }
    </div>
    )
}
export default Game;