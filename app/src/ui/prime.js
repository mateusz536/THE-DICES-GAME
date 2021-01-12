import Axios from 'axios'
import { TextField, Button } from '@material-ui/core';
import {useState} from 'react'

const wzor = require('./jsonwzor')
const default_state = wzor.jsonik;


function Prime({toggleGameStarted, setIdentity}) {
    const [inputId, setInputId] = useState("")
    const [nick, setNick] = useState("")
    const [error, setError] = useState("")

    async function getGameId() {
        try {
          const response = await Axios({
            method: "get",
            url: "http://localhost:3210/game",
          });
    
          setIdentity([response.data.gameid, 1, nick])
          toggleGameStarted(true)
          console.log(nick)
        } catch (error) {
          console.error(error);
        }
      }
      async function joinGame(id) {
        try {
            const response = await Axios({
            method: "get",
            url: `http://localhost:3210/game/${id}`,
          });
          if (response.data.player > 0) {
            
            setIdentity([id, response.data.player, nick])
            setTimeout(() =>toggleGameStarted(true), 1000)
          } else {

          }
          
          
        } catch (error) {
          console.error(error);
        }
      }
    const onStartNewGame = () => {
        getGameId()
    }



    return (
        <div className='prime'>
            <h1 className='title'>WELCOME TO THE GAME OF DICE</h1>
            <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
                <TextField  label="Input game ID" variant="outlined" onChange={(e) => setInputId(e.target.value)}></TextField>
                <Button style={{marginLeft: '20px'}}variant="contained" onClick={() => joinGame(inputId)} size="large">JOIN</Button>
            </div>
            <h2>OR</h2>

            <Button variant="contained" color="secondary" onClick={onStartNewGame}>START NEW GAME</Button>
        </div>
    )
}

export default Prime;