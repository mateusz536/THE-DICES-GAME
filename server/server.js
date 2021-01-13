
const diceRoll = require('./gameFunctions/diceRoll');
const express = require('express');
const uuid = require('uuid')
const app = express();
const uuidv4 = uuid.v4
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
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
            console.log('START')
            let game1 = games.find(g => g.id === req.body.id)
            game1.started = true
            let id1 = req.body.id;
            client.publish(`game/${id1}`, JSON.stringify(game1))
            return res.send(true)

        case actions.REROLL:
            console.log('reroroll')
            let game2 = games.find(g => g.id === req.body.id);
            let dices = req.body.dices_state;
            if (dices.length === 0) {
                for (let i=0; i<5;i++) {
                    dices = [...dices, diceRoll()]
                }
            }
            let new_dices = dices.reduce((accum,next) => {
                if (!next.clicked) {
                    next = diceRoll();
                }
                return [...accum, next]
            },[])
            game2.rerolls += 1
            game2.dices_state = new_dices;
            client.publish(`game/${req.body.id}`, JSON.stringify(game2));
            return res.send(true)

        case actions.CHOICE:
            console.log('choice')
            let game3 = games.find(g => g.id === req.body.id)
            if (game3.move === game3.state.length) {
                game3.move = 1
            } else {
                game3.move +=1
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
// dopiero gdy gra się rozpocznie opublikuje początkowy stan gry

//dołączanie do gry
// app.get('/game/:idGame', (req, res) => {
//     let game = games.find(g => g.id === req.params.idGame)

//     if (!game.started && game.state.length < 3) {
//         let newp = player_state(game.state.length + 1)
//         game.state = [...game.state, newp]
//         res.send({player: game.state.length})
//     } else res.send({player: -1})
                    
// })

// app.get('/game/:idGame/start', (req,res) => {
//     let game = games.find(g => g.id === req.params.idGame)
//     game.started = true
//     let id = req.params.idGame;
//     client.publish(`game/${id}`, JSON.stringify(game))
//     res.send(true)
// })

// app.post ('/game/:idGame/reroll', (req,res) => {
//     let game = games.find(g => g.id === req.params.idGame);
//     let dices = req.body.dices_state;
//     if (dices.length === 0) {
//         for (let i=0; i<5;i++) {
//             dices = [...dices, diceRoll()]
//         }
//     }
//     let new_dices = dices.reduce((accum,next) => {
//         if (!next.clicked) {
//             next = diceRoll();
//         }
//         return [...accum, next]
//     },[])
//     game.rerolls += 1
//     game.dices_state = new_dices;
//     client.publish(`game/${req.params.idGame}`, JSON.stringify(game));
//     res.send(true)
// })

// app.post ('/game/:idGame/choice', (req,res) => {
//     game = games.find(g => g.id === req.params.idGame)
//     if (game.move === game.state.length) {
//         game.move = 1
//     } else {
//         game.move +=1
//     }
    
//     game.dices_state = []
//     game.rerolls = 0
//     player = game.state.find(p => p.player === req.body.player);
//     points = player.points.find(p => p.name === req.body.name);
//     points.value = req.body.points;
//     points.chosen = true
//     client.publish(`game/${req.params.idGame}`, JSON.stringify(game));
//     res.send(true)
// })


app.listen(3210, () => {
    console.log('listening on port: 3210')
})

