const jsonik = {
    id: '',
    started: false,
    state: [],
    move: 1,
    rerolls: 0,
    dices_state: [],
    clicked_dices:[],
    action: '',
    rounds: 0,
    winner: null
    }
const genPlayerState = (id) => ({ 
    player: id,
        points: [
        {value:0, name: '1', chosen: false},
        {value:0, name: '2',chosen: false},
        {value:0, name: '3',chosen: false},
        {value:0, name: '4',chosen: false},
        {value:0, name: '5',chosen: false},
        {value:0, name: '6',chosen: false},
        {value:0, name: '3x',chosen: false},
        {value:0, name: '4x',chosen: false},
        {value:0, name: '3+2x',chosen: false},
        {value:0, name: 'small straight',chosen: false},
        {value:0, name: 'big straight',chosen: false},
        {value:0, name: 'general',chosen: false},
        {value:0, name: 'chance',chosen: false},
        {value:0, name: 'sum'}
    ]
})


module.exports =  {jsonik, genPlayerState}

