function calculateDiceState (dices) {
    let x = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0
    }
  
    dices.forEach(element => {
      x[String(element.value)] +=1
    });
  
    return x
  }
  
  function calculateValue(name,value, dicesState) {
    if (value == 0) {
      let x = calculateDiceState(dicesState)
        switch (name) {
        case '1':
            return x['1']

        case '2':
            return x['2']*2
      
        case '3':
            return x['3']*3

        case '4':
            return x['4']*4

        case '5':
            return x['5']*5

        case '6':
            return x['6']*6

        case '3x':
            let val1 = 0
            let iscor1 = false
            for (let i in x) {
                if (x[i] == 3) {
                    val += 3*Number(i)
                    iscor1 = true
                } else {
                    val += Number(i)*x[i]
                }
            }
            if (iscor) {
                return val
            }
            return 0
        case '4x':
            let val2 = 0
            let iscor = false
            for (let i in x) {
                if (x[i] == 4) {
                    val += 4*Number(i)
                    iscor = true
                } else {
                    val += Number(i)*x[i]
                }
            }
            if (iscor) {
                return val
            }
            return 0
        
        case 'small straight':
            let ar = [];
            dicesState.forEach(el => {
                ar = [...ar, el.value]
            });
            ar.sort((a,b) => a-b < 0);
            let counter = 0;
            uniq = [...new Set(ar)];
            console.log(uniq)
            if (uniq.length === 4) {
                if (uniq[0] == uniq[1] - 1 && uniq[1] == uniq[2] - 1 && uniq[2] == uniq[3] - 1) {
                    return 30
                }

            }
            return 0
            


        case 'big straight':
            let ar1 = [];
            dicesState.forEach(el => {
                ar1 = [...ar, el.value]
            });
            ar1.sort((a,b) => a-b < 0);
            let counter1 = 0;
            uniq = [...new Set(ar)];
            console.log(uniq)
            if (uniq.length === 5) return 40
            return 0

        case 'general':
            for (let i in x) {
                if (x[i] === 6) return 50
            }
            return 0
        
        case 'chance':
            let p = 0
            for (let i in x) {
                p += x[i];
            }
            return p
            
  
      }
    }
  }
  

console.log(calculateValue('small straight', 0, [{value:1},{value:2}, {value:2}, {value:3}, {value:4}]))

let arr = [1,1,2,3,5,5]
uniq = [...new Set(arr)];

console.log(uniq)
  