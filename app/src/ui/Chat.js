import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {TextField, Button} from '@material-ui/core'
import {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';

const Chat = ({state,cl,chatState, sendMessage}) => {
    const [message, setMessage] = useState('')
    const [target, setTarget] = useState('')
    const handleChange = (event) => {
        setTarget(event.target.value)
    }

    const useStyles = makeStyles((theme) => ({
        formControl: {
            minWidth: 90,
        },
      }));
    const classes = useStyles();

    const reversedChat = (chat) => {
	console.log(chatState)
	return chat.slice(-5)
}
    const createMessage = (msg) => {
        let mess = "";
        if (msg.player !== -1 && msq.player !== 0) {
            if (msg.player === 0 ) msg.player = 'spectator'
            if (msg.target === 'All' || msg.target === "") {
                    mess += "(All) | ";
        }       else {
                    mess += "(Direct) | ";
        }
            if (msg.priv) {
                    (msg.target===identity[1]) ? mess+= `from Player ${msg.player}: `:
                    mess+= `to Player ${msg.player}: `;
        }       else {
                    mess += `Player ${msg.player}: `;
        }
    } 
        if (msg.player === 0) {
            mess += `(SPECTATOR): `
        }
        mess += msg.message
        return mess;
    }



    return (
        <div className={cl?'lobbychat' : 'chat'}>
            <div className='messdispl'>
                {reversedChat(chatState).map(m => <p className={`mess${m.player}`}>{createMessage(m)}</p>)}
            </div>
            <div style={{marginTop: '50px'}}>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label">target</InputLabel>
                <Select
                defaultValue="all"
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={target}
                onChange={handleChange}
                >
                <MenuItem value="All">
                    <em>All</em>
                </MenuItem>
                {state.map(p => <MenuItem value={p.player}>Player {p.player}</MenuItem>)}
                </Select>
            </FormControl>
                <TextField id='chatinput' label="Chat" variant="outlined" onChange={(e) => setMessage(e.target.value)}></TextField>
                <Button style={{marginTop: '10px', marginLeft:'5px'}}variant='contained' color='primary' onClick={() => sendMessage(message,target)}>send</Button>
            </div>
        </div>
    )
}

export default Chat
