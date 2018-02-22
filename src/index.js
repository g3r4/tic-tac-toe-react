import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class HistoryButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          active: false,
      };
    }
    render() {
      return (                
        <button className={this.props.move === this.props.step ? 'selected-move-button': null}
                onClick={this.props.onClick}
        >{this.props.desc}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return <Square value={this.props.squares[i]} 
                     onClick={() => this.props.onClick(i)}/>;
    }
  
    render() {  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
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
        }],
        stepNumber: 0,
        xIsNext: true,
        lastIndexPlayed: 0
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
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        lastIndexPlayed: i,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      var new_element_index = 0;

      const moves = history.map((step, move, arr) => {
        for (var i=0, len = arr[move].squares.length; i < len; i++){
          if (arr[move].squares[i] !== arr[(move <= 0 ? 0 : move-1)].squares[i]){
            new_element_index = i;
            break;
          }
        }
        var pos_x = Math.trunc((new_element_index/3)+1);
        var pos_y = (new_element_index%3)+1;
        const desc = move ?
          'Go to move #' + move + ' at (' + pos_x + ',' + pos_y + ')':
          'Go to game start';
          return (
            <li key={move}>
                <HistoryButton 
                  onClick={() => this.jumpTo(move)}
                  desc={desc}
                  move={move}
                  step={this.state.stepNumber}
                />
            </li>        
          );
      });
    
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          </div>
          <div className="game-info">
            <div>{status}</div>
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
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  