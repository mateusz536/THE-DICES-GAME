function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function getRolls() {


    let x = getRandomInt(1,7)

    return {value: x, clicked: false}
}

const calculateSum = (points) => {
  let sum = 0
  points.forEach(el => {
    sum += el.value
  })
  return sum
}

function findWinner(state) {
    let winner = state[0];
    state.forEach(element => {
	let win = calculateSum(winner.points)
	let x = calculateSum(element.points)
        if (x > win) {
            winner = element;
        }
        
    });
    return winner.player
}


module.exports = {getRolls, findWinner};
