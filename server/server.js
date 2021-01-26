
const functions = require('./gameFunctions/functions');
const express = require('express');
const uuid = require('uuid')
const app = express();
const uuidv4 = uuid.v4
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://10.45.3.52:1883');
const wzor = require('./jsonwzor')
const default_game = wzor.jsonik;
const player_state = wzor.genPlayerState;
const cors = require('cors')
const actions = require('./gameFunctions/actions')
app.use(express.json());
app.use(cors())
 
let games = [];
 
 
 
app.post('/game', (req,res) => {
    switch (req.body.activity) {
 
        case actions.CREATE:
            let id = uuidv4();
            games = [...games, {...default_game, id: id, state: [player_state(1)]}]
            return res.send({gameid: id})
 
 
        case actions.START:
            let game1 = games.find(g => g.id === req.body.id)
            game1.started = true
            let id1 = req.body.id;
            client.publish(`game/${id1}`, JSON.stringify(game1))
            return res.send(true)
 
        case actions.REROLL:
            let game2 = games.find(g => g.id === req.body.id);
            let dices = req.body.dices_state;
            if (dices.length === 0) {
                for (let i=0; i<5;i++) {
                    dices = [...dices, functions.getRolls()]
                }
            }
            let new_dices = dices.reduce((accum,next) => {
                if (!next.clicked) {
                    next = functions.getRolls();
                }
                return [...accum, next]
            },[])
            game2.rerolls += 1
            game2.dices_state = new_dices;
            client.publish(`game/${req.body.id}`, JSON.stringify(game2));
            return res.send(true)
 
        case actions.CHOICE:
            let x1 = req.body.state
            let x2 = req.body.dices_state
            let x3 = req.body.player
            let x4 = req.body.rounds
            let x5 = req.body.rerolls
 
            const obj = {
                state: x1,
                dices_state: x2,
                move: x3,
                rounds: x4,
                rerolls: x5,
                last: req.body.points
            }
 
 
            game6 = games.find(x => x.id === req.body.id)
            game6.prevState = obj
            if (game6.move === game6.state.length) {
                game6.move = 1
            } else {
                game6.move += 1
            }
            if (req.body.player === game6.state.length) {
                if (game6.rounds === 12) {
                    let winner = functions.findWinner(game6.state);
                    let ret = {winner: winner}
                    return client.publish(`game/${req.body.id}`, JSON.stringify(ret))
                } else {
                    game6.rounds += 1
                }
            } 
            game6.dices_state = []
            game6.rerolls = 0
            game6.firstMove = true
 
            player = game6.state.find(p => p.player === req.body.player);
            points = player.points.find(p => p.name === req.body.name);
            points.value = req.body.points;
            points.chosen = true
            client.publish(`game/${req.body.id}`, JSON.stringify(game6));
            return res.send(true)

        case actions.JOIN:
            let game = games.find(g => g.id === req.body.id)

            if (!game.started && game.state.length < 3) {
                let newp = player_state(game.state.length + 1)
                game.state = [...game.state, newp]
                return res.send({player: game.state.length})
            } else return res.send({player: 0})

        case actions.CHANGE:
            let game4 = games.find(g => g.id === req.body.id);
            game4.voting = true;
		console.log('change')
            client.publish(`game/${req.body.id}/chat`, JSON.stringify({id: -1, player: -1, message: `PLAYER ${req.body.player} WANTS TO CHANGE MOVE`}));
            client.publish(`game/${req.body.id}/chat`, JSON.stringify({id: -1, player: -1, message: `WRITE /allow TO LET HIM CHANGE`}));
            client.publish(`game/${req.body.id}`, JSON.stringify(game4));

        default:
            return res.send(true)
 
        }
})
 
app.post('/chat', (req,res) => {
    console.log(req.body)
    let id = req.body.id;
    let playerid = req.body.player;
    let message = req.body.message;
    let priv = req.body.priv;
    let target = req.body.target;
    let son = {
        player: playerid,
        message: message,
        target: target,
	priv: priv
    }
    if (target === 'All' || target === '') {
        (target === '') ? target='All' : target = target;
        if (message.startsWith('/allow')) {
            games = games.reduce((a, b) => {
                if (b.id === id) {
                    b.votes += 1
                    if (b.votes === b.state.length - 1) {
                        let prevState = b.prevState
                        b = {...b, ...prevState}
                        b.firstMove = false
                        b.voting = false
                        b.votes = 0
                        client.publish(`game/${id}`, JSON.stringify(b));
                        client.publish(`game/${id}/chat`, JSON.stringify({id: -1, player: -1, message: `PREVIOUS STATE OF THE GAME`}));
                    }
                }
                return [...a, b]
            },[])
 
        } else {
            client.publish(`game/${id}/chat`, JSON.stringify(son));
        }
 
    } else {
        client.publish(`game/${id}/chat/${target}`, JSON.stringify(son))
    }
 
    res.send(true)
})
 
 
app.listen(3210, () => {
    console.log('listening on port: 3210')
})
 
