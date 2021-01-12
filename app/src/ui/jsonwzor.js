const jsonik = {
    id: '',
    state: [],
    move: 1,
    rerolls: 0,
    dices_state: [],
    started:false
    }
const player_state = { player: 1,
    points: [
        {value:0, name: '1'},
        {value:0, name: '2'},
        {value:0, name: '3'},
        {value:0, name: '4'},
        {value:0, name: '5'},
        {value:0, name: '6'},
        {value:0, name: '3x'},
        {value:0, name: '4x'},
        {value:0, name: '3+2x'},
        {value:0, name: 'small straight'},
        {value:0, name: 'big straight'},
        {value:0, name: 'general'},
        {value:0, name: 'chance'}
    ]
}
module.exports =  {jsonik, player_state}

