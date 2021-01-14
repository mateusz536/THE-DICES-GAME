import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios'
import {v4 as uuidv4} from 'uuid'

const useStyles = makeStyles({
  table: {
    minWidth: 100
  },
});

function createData(player, points) {
  return { player, points};
}

// to zwraca slownik dzieki ktoremu bedzie latwiej obliczyc punkty
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
                  val1 += 3*Number(i)
                  iscor1 = true
              } else {
                  val1 += Number(i)*x[i]
              }
          }
          if (iscor1) {
              return val1
          }
          return 0

      case '3+2x':
        let is3 = false;
        let is2 = false;
        for (let i in x) {
          if (x[i]===3) {
            is3 = true
          }
          if (x[i] === 2) {
            is2 = true;
          }

          
        }
        if (is3 && is2) return 25
          else return 0

      case '4x':
          let val2 = 0
          let iscor = false
          for (let i in x) {
              if (x[i] == 4) {
                  val2 += 4*Number(i)
                  iscor = true
              } else {
                  val2 += Number(i)*x[i]
              }
          }
          if (iscor) {
              return val2
          }
          return 0
      
      case 'small straight':
          let ar = [];
          dicesState.forEach(el => {
              ar = [...ar, el.value]
          });
          ar.sort((a,b) => a-b);
          let uniq1 = [...new Set(ar)];
          if (uniq1.length === 4) {
              if (uniq1[0] == uniq1[1] - 1 && uniq1[1] == uniq1[2] - 1 && uniq1[2] == uniq1[3] - 1) {
                  return 30
              }

          }
          return 0
          


      case 'big straight':
          let ar1 = [];
          dicesState.forEach(el => {
              ar1 = [...ar1, el.value]
          });
          ar1.sort((a,b) => a-b);
          let uniq = [...new Set(ar1)];
          if (uniq.length === 5) {
            if (uniq[0] == uniq[1] - 1 && uniq[1] == uniq[2] - 1 && uniq[2] == uniq[3] - 1 && uniq[3] == uniq[4] - 1) {
              return 40
          }
          } 
          return 0

      case 'general':
          for (let i in x) {
              if (x[i] === 5) return 50
          }
          return 0
      
      case 'chance':
          let p = 0
          for (let i in x) {
              p += x[i]*i;
          }
          return p
          

    }
  } else {
    return value
  }
}

console.log(calculateValue('1',0,[{value:1}, {value:1}, {value:2}]));

const calculateSum = (points) => {
  let sum = 0
  points.forEach(el => {
    sum += el.value
  })
  return sum
}

const setToSet=(id) => {
  document.getElementById(id).className = 'pointed'
}



export default function BasicTable({currentMove,gameid,dices, points, playerid, tableid}) {
  const classes = useStyles();

  const findinpoints =  (name) => {
    let x = points.find(p => p.name === name);
    return x.chosen
  }
  


  const rowsgen = () =>{
  if (currentMove===playerid && tableid===playerid) {
    return [
      createData('1', calculateValue('1', points[0].value, dices)),
      createData('2', calculateValue('2', points[1].value, dices)),
      createData('3', calculateValue('3',points[2].value, dices)),
      createData('4', calculateValue('4', points[3].value, dices)),
      createData('5', calculateValue('5', points[4].value, dices)),
      createData('6', calculateValue('6', points[5].value, dices)),
      createData('3x', calculateValue('3x', points[6].value, dices)),
      createData('4x', calculateValue('4x', points[7].value, dices)),
      createData('3+2x',calculateValue('3+2x', points[8].value, dices)),
      createData('small straight', calculateValue('small straight', points[9].value, dices)),
      createData('big straight', calculateValue('big straight', points[10].value, dices)),
      createData('general', calculateValue('general', points[11].value, dices)),
      createData('chance', calculateValue('chance', points[12].value, dices)),
      createData('sum',calculateSum(points))
    ];
  }else {
    return [
      createData('1', (points[0].chosen) ? points[0].value: "" ),
      createData('2',(points[1].chosen) ? points[1].value: ""  ),
      createData('3', (points[2].chosen) ? points[2].value: ""  ),
      createData('4',(points[3].chosen) ? points[3].value: "" ),
      createData('5',(points[4].chosen) ? points[4].value: ""  ),
      createData('6',(points[5].chosen) ? points[5].value: "" ),
      createData('3x',(points[6].chosen) ? points[6].value: ""  ),
      createData('4x',(points[7].chosen) ? points[7].value: "" ),
      createData('3+2x',(points[8].chosen) ? points[8].value: "" ),
      createData('small straight', (points[9].chosen) ? points[9].value: ""  ),
      createData('big straight', (points[10].chosen) ? points[10].value: ""  ),
      createData('general',(points[11].chosen) ? points[11].value: "" ),
      createData('chance', (points[12].chosen) ? points[12].value: "" ),
      createData('sum',calculateSum(points))
    ];
  }
}
  const rows = rowsgen();

  async function sendChoice(name, point) {
    if (currentMove === playerid && name !== 'sum' && !findinpoints(name)) {
      try {
          const response = await Axios({
          method: "post",
          url: `/game`,
          data: {
            player: playerid,
            name: name,
            points: point,
            activity: 5,
            id: gameid
          }
        });
        console.log(response)
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <TableContainer className='ptable'  component={Paper}>
      <Table className={classes.table} className='ptable' aria-label="simple table" size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Player {playerid}</TableCell>
            <TableCell onClick={()=> console.log('siema')} align="right">points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
          
          let rowid = uuidv4()
          return (
            <TableRow key={row.player} id={rowid}>
              <TableCell component="th" scope="row">
                {row.player}
              </TableCell>
              <TableCell 
              className={`${playerid === currentMove && row.player!=='sum' && tableid===playerid && !findinpoints(row.player) ? "move" : ""}`}
              align="right"
              style={findinpoints(row.player)? {fontWeight:'bolder'} : {fontWeight: 'normal'}}
              onClick={()=> {
                sendChoice(row.player, row.points)
                setToSet(rowid)
              }}>{row.points}</TableCell> 
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );

}