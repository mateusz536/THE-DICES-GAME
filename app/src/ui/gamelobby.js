import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import {Button, TextField} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import {useState} from 'react'
import Chat from './Chat'


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



export default function Gamelobby({state,id, chatState, sendMessage, setMessage}) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        copyToClipboard(id[0])
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    }
    function copyToClipboard(text) {
        var input = document.body.appendChild(document.createElement("input"));
        input.value = id[0];
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
                <Chat cl='lobbychat' state={state} chatState={chatState} sendMessage={sendMessage} identity={id[0]}/>
                {id[1] === 1 ?<Button variant='contained'color='primary' onClick={() => start(id[0])}>START THE GAME</Button>
                :
                <div></div>
}
            </div>
        </div>
    )

}