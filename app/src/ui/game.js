import React, { useState,  useEffect } from 'react';
import dice1 from '../materials/dice1.png'
import dice2 from '../materials/dice2.png'
import dice3 from '../materials/dice3.png'
import dice4 from '../materials/dice4.png'
import dice5 from '../materials/dice5.png'
import dice6 from '../materials/dice6.png'
import {v4 as uuidv4} from 'uuid'
import FastRewindIcon from '@material-ui/icons/FastRewind';
import {Button,TextField} from '@material-ui/core'
import BasicTable from './table'
import Chat from './Chat'
import Axios from 'axios'
import Gamelobby from './gamelobby'


const wzor = require('./jsonwzor')
const jsonik = wzor.jsonik;
const player_state = wzor.player_state;
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://10.45.3.52:8000/mqtt');



function Game({identity}) {
    const [gameState, setGameState] = useState({ started: false, state: [], dices_state:[]});
    const [chatState, setChatState] = useState([]);
    const [clicked, setClicked] = useState([]);
    
    useEffect(() => {
        client.on('connect', () => {
        console.log('connected to broker');
    })
    client.subscribe(`game/${identity[0]}`);
    client.subscribe(`game/${identity[0]}/chat`);
    client.subscribe(`game/${identity[0]}/chat/${identity[1]}`);
    client.publish(`game/${identity[0]}/chat`, JSON.stringify({player: identity[1], message: 'CONNECTED', target: 'All', priv: false}));
    
    client.on('message', function (topic, message) {
        if (topic === `game/${identity[0]}`) {
            let resp = JSON.parse(message.toString());
                setGameState(resp);   
            } else {
                setChatState(chatState => [...chatState,JSON.parse(message.toString())]);
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
    
    


    const isMove = () => {
        return (identity[1] === gameState.move) ? true : false;
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
                document.getElementById(ids).style.border = 'black solid 2px';
            } else {
                document.getElementById(ids).style.border = 'none';
            }
        }
    }

    const sendMessage = async (mess, target) => {
        document.getElementById('chatinput').value="";
	if (mess !== "") {
	(mess.length > 35) ? mess = mess.slice(0,35) : mess = mess
	let priv;
	if (chatState.length > 8) {
		setChatState(chatState.slice(-7))
	}
	if ( target === "" || target === "All"  ) {
		priv = false;
	} else if (target === identity[1]) {
		priv = true;
	}
	 else {
		priv = true;
		setChatState([...chatState, {priv: true, player: identity[1], message: mess, target: target}])
	}
        try {
            await Axios({
            method: "post",
            url: `/chat`,
            data: {priv: priv,id: identity[0], player: identity[1], message: mess, target: target}
        });
        } catch (error) {
            console.error(error);
        }
    }
}
	const nextMove = (mm) => {
		if (mm === gameState.state.length) {
			return 1
		} else return mm+1
}


    return (
        <div> 
            {gameState.winner ? (<div style={{textAlign:'center'}}> <h1>WINNER IS PLAYER {gameState.winner}</h1></div>) 
            : <div>{gameState.started ?
                    <div className="game">
                        <div className='display'>
                            <div className='top'>
                                <Chat state={gameState.state} chatState={chatState} identity={identity} sendMessage={sendMessage}/>
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
				    {(nextMove(identity[1]) === gameState.move) ? <FastRewindIcon variant="contained" ></FastRewindIcon>: <div></div>}
                                    </div>
                                </div>
                                <div className='info'>
                                    <h3 style={{ marginTop: '1vh' }}>You are player {identity[1]}</h3>
                                    <h2 style={{ marginTop:'1vh' }}>move: player {gameState.move}</h2>
                                    <h2 style={{color: 'orange', marginTop: '1vh'}}>rerolls left {3-gameState.rerolls}</h2>
                                    
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
                    </div>: <Gamelobby state={gameState.state} chatState={chatState} sendMessage={sendMessage}  id={identity} connectedplayers={gameState.state.length}/> 
                    
                    }   </div>
            }
    </div>
    )
}
export default Game;
