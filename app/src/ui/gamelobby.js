import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import {Button, TextField} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import {useState} from 'react'


async function start(id) {
    try {
        await Axios({
        method: "post",
        url: `/game`,
        data: {activity: 2, id: id}
        });
    } catch (error) {
        console.error(error);
    }
}

function Alert(props) {
return <MuiAlert elevation={6} variant="filled" {...props} />;
}



export default function Gamelobby({id, chatState, sendMessage, setMessage}) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        copyToClipboard(id)
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    }
    function copyToClipboard(text) {
        var input = document.body.appendChild(document.createElement("input"));
        input.value = id;
        input.focus();
        input.select();
        document.execCommand('copy');
        input.parentNode.removeChild(input);
    }
    return (
        <div>
            <div className='gamelobby'>
                <div>
                <h1 className='title'>GAME LOBBY</h1>
                <h3 className='title'>SEND GAME ID TO YOUR FRIEND</h3>
                <Button onClick={handleClick} variant='contained'color='secondary'>Copy ID to clipboard</Button>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
                    <Alert onClose={handleClose} severity="success">
                        ID COPIED!
                    </Alert>
                </Snackbar>
                </div>
                <div className='chat' style={{margin: 'auto', marginTop:'20px', marginBottom:'20px'}}>
                                    <div className='messdispl'>
                                        {chatState.slice(0,5).map(m => <p className='mess'>Player {m.player}: {m.message}</p>)}
                                    </div>
                                    <div style={{marginTop: '50px'}}>
                                        <TextField id='chatinput' label="Chat" variant="outlined" onChange={(e) => {setMessage(e.target.value)}}></TextField>
                                        <Button style={{marginTop: '10px', marginLeft:'5px'}}variant='contained' color='primary' onClick={() => sendMessage()}>send</Button>
                                    </div>
                </div>
                <Button variant='contained'color='primary' onClick={() => start(id)}>START THE GAME</Button>
            </div>
        </div>
    )

}