import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    let buttonClass = "square";
    if (this.props.highlight) {
      buttonClass = "square highlight";
    }
    return (
      <button
          className={buttonClass}
          onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    let winner = this.props.winningSquares.includes(i);
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlight={winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  renderRow(x) {
    const squareArray = [];
    for (let j=0; j<=2; j++) {
        squareArray[j] = this.renderSquare(j+x);
      }
    return squareArray;
  }
  
  createBoard() {
    const finalBoard = [];
    for (let x=0; x<=6; x+=3) {
      finalBoard.push(<div className='board-row' key={x}>{this.renderRow(x)}
        </div>);
    }
    return finalBoard;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        latestMove: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        latestMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      descending: false,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggle() {
    this.setState({
      descending: !this.state.descending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move, his) => {
      let latest = his[move].latestMove;
      let col;
      let row;
      if (latest % 3 === 0) {
        col = 1;
      } else if (latest === 1 || latest === 4 || latest === 7) {
        col = 2;
      } else if (latest === 2 || latest === 5 || latest === 8) {
        col = 3;
      }

      if (latest <= 2) {
        row = 1;
      } else if (latest <= 5) {
        row = 2;
      } else if (latest <= 8) {
        row = 3;
      }

      const desc = move ?
      'Go to move #' + move + ` (col: ${col}, row: ${row})`:
      'Go to game start';
      
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className='bold'>{desc}</button>
          </li>
        );
      } else {        
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    // Toggle ascending/descending
    let toggleValue = 'Show descending';
    if (this.state.descending) {
      moves.reverse();
      toggleValue = 'Show ascending';
    }

    let winningSquares = [];
    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
      winningSquares = winner[1];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="moveList">Moves: <button onClick={() => this.toggle()} className="toggle">{toggleValue}</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      let winnerAndNumbers = [squares[a], lines[i]];
      return winnerAndNumbers;
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
