import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button style={{color: props.color}} className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
    
  renderSquare(i) {
    return (<Square color={this.props.colors[i]} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />);
  }
  renderRow(i) {
      let row = [];
      for(let j=3*i; j<3*i+3; j++) {
          row.push(this.renderSquare(j));
      }
      return(<div className="board-row">{row}</div>);
  }
  renderTable() {
      let table = [];
      for(let i=0; i<3; i++) {
          table.push(this.renderRow(i));
      }
      return table;
  }
  
    
 render() {
      
    return (
      <div>
        {this.renderTable()}
      </div>
        
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reverse: false,
            isNextX: true,
            stepNum: 0,
            
            history: [
                {
                    squares: Array(9).fill(null),
                    squaresColor: Array(9).fill('black'),
                    pos: null,
                }
            ],
        };
    }
    
    handleClick(i) {
        
        
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const colors = current.squaresColor.slice();
        const isNextX = this.state.isNextX;
        
        if(judgeWinner(current.squares)[0] || current.squares[i]) {
            return;
        }
        
         
        squares[i] = isNextX? 'X' : 'O';
        this.setState({
            
            isNextX: !isNextX,
            history: history.concat([
                {
                    squares: squares,
                    squaresColor: colors,
                    pos: i,
                }
            ]),
            stepNum: history.length,
        });
    }
    
    jumpTo(move) {
        this.setState({
            stepNum: move,
            isNextX: (move % 2) === 0, 
        });
    }
    
    toggleSort() {
        this.setState({
            reverse: !this.state.reverse,
        });
    }
    
  render() {
      let history = this.state.history;
      let current = history[this.state.stepNum];
      let [winner, winState] = judgeWinner(current.squares);
      let newColors = current.squaresColor;
      
      
      if(winner) {
          for(let index of winState) {
              newColors[index] = 'red';
          }
      }
      
      const moves = history.map((step, move) => {
          const realMove = this.state.reverse? (history.length - 1 - move) : move;
          const pos = history[realMove].pos;
          const [x, y] = [pos % 3, parseInt(pos / 3, 10)];
          
          const desc = realMove ?
                ('Go to move #' + realMove + ` (${x+1}, ${y+1})`) :
                'Go to game start';
          const info = (realMove === this.state.stepNum) ?
                (<b>{desc}</b>) : (desc);
          
          return (
          <li key={move} value={realMove+1}>
              <button onClick={() => this.jumpTo(realMove)}>{info}</button>
          </li>
          );
      });
      
      let status;
      if(winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.isNextX? 'X' : 'O');
      }
      
    return (
      <div className="game">
        <div className="game-board">
          <Board colors={newColors} squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>toggle sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function judgeWinner(squares) {
        const winLine = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for(let line of winLine) {
            let [a, b, c] = line;
            if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
                return [squares[a], [a, b, c]];
            }
        }
        return [null, null];
    }
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
