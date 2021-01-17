function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRolls() {


    let x = getRandomInt(1,7)

    return {value: x, clicked: false}
}

function findWinner(state) {
    let winner = state[0];
    state.forEach(element => {
        if (element.points[13] > winner.points[13]) {
            winner = element;
        }
        
    });
    return winner.player
}


module.exports = {getRolls, findWinner};