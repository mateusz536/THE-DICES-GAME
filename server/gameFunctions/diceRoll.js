function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// function getRolls(quantity) {
//     let rolls = []
//     if (quantity > 5) {
//         quantity = 5
//     }
//     for (let i = 0; i<quantity; i++) {
//         let x = getRandomInt(1,7)
//         rolls = [...rolls, {value: x, clicked: false}]
//     }
//     return rolls
// }

function getRolls() {


    let x = getRandomInt(1,7)

    return {value: x, clicked: false}
}


module.exports = getRolls