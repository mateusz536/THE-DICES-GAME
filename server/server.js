
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
    console.log(req.body.activity === actions.START)
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
            
            let game3 = games.find(g => g.id === req.body.id)
            if (game3.move === game3.state.length) {
                game3.move = 1
            } else {
                game3.move +=1
            }
            if (req.body.player === game3.state.length) {
                if (game3.rounds === 12) {
                    let winner = functions.findWinner(game3.state);
                    let ret = {winner: winner}
                    return client.publish(`game/${req.body.id}`, JSON.stringify(ret))
                } else {
                    game3.rounds += 1
                }
            } 
            game3.dices_state = []
            game3.rerolls = 0
            player = game3.state.find(p => p.player === req.body.player);
            points = player.points.find(p => p.name === req.body.name);
            points.value = req.body.points;
            points.chosen = true

            client.publish(`game/${req.body.id}`, JSON.stringify(game3));
            return res.send(true)

        case actions.JOIN:
            console.log(req.body.activity)
            console.log(actions.JOIN)
            let game = games.find(g => g.id === req.body.id)

            if (!game.started && game.state.length < 3) {
                let newp = player_state(game.state.length + 1)
                game.state = [...game.state, newp]
                return res.send({player: game.state.length})
            } else return res.send({player: -1})

        
        default:
            return res.send(true)

        }
})

app.post('/chat', (req,res) => {
    let id = req.body.id;
    let playerid = req.body.player;
    let message = req.body.message;
    if (message.length > 40) {
	message = message.slice(0,40);
}
    let target = req.body.target;
    let son = {
        player: playerid,
        message: message,
        target: target
    }
    if (target === 'All' || target === '') {
        (target === '') ? target='All' : target = target;
        client.publish(`game/${id}/chat`, JSON.stringify(son));
    } else {
        client.publish(`game/${id}/chat/${target}`, JSON.stringify(son))
    }
    
    res.send(true)
})

app.listen(3210, () => {
    console.log('listening on port: 3210')
})

