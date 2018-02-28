import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    let highlightClass = props.weHaveAWinner === true && props.winnerSquares.includes(props.squareIndex)? 'highlight':'';
    return (
      <button className={'square ' + highlightClass} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class HistoryButton extends React.Component {

    constructor(props) {
      super(props);
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

    constructor(props) {
      super(props);
    }
    
    renderSquare(i) {
      return <Square value={this.props.squares[i]} 
                     onClick={() => this.props.onClick(i)}
                     weHaveAWinner = {this.props.weHaveAWinner}
                     winnerSquares = {this.props.winnerSquares}
                     squareIndex = {i}
              />;
    }

    createSquaresForBoard(rowsNumber) {
      let rows = [];
      for(var i = 0; i < rowsNumber; i++){
        let squares = [];
        for(var j = 0; j < rowsNumber; j++){
          squares.push(this.renderSquare( (rowsNumber*i) + j));
        }
        rows.push(<div className="board-row">{squares}</div>);
      }
      return rows;
    }
  
    render() {  
      return (
        <div>
          { this.createSquaresForBoard(3) }
        </div>
      );
    }
  }

  class MovesList extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        ascending: true
      };
    }

    sortList = () => {
      this.setState({
        ascending: !this.state.ascending,
      });
    }

    render(){
      var new_element_index = 0;
      const moves = this.props.history.map((step, move, arr) => {
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
                  onClick={() => this.props.onClick(move)}
                  desc={desc}
                  move={move}
                  step={this.props.stepnumber}
                />
            </li>        
          );
      });
      return (
        <div>
          <button onClick={this.sortList}>
            {this.state.ascending ? 'Sorted by ascending order' : 'Sorted by descending order'}  
          </button>
          {this.state.ascending ? moves : moves.reverse()}
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
        lastIndexPlayed: 0,
        winnerSquares: [],
        weHaveAWinner: false
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (this.calculateWinner(squares) || squares[i]) {
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
      const winner = this.calculateWinner(current.squares);
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else if (!winner && this.state.stepNumber < 9) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'The game has ended in a draw';
      }
      return (
        <div className="game">
          <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            weHaveAWinner = {this.state.weHaveAWinner}
            winnerSquares = {this.state.winnerSquares}
          />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <MovesList 
              history = {this.state.history}
              stepnumber = {this.state.stepNumber}
              onClick = {(step) => this.jumpTo(step)}/>
          </div>
        </div>
      );
    }

    calculateWinner = (squares) => {
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && !this.state.weHaveAWinner) {
          this.setState({
            weHaveAWinner: true,
            winnerSquares: [a, b, c]
          });
          return squares[a];
        }
      }
      return null;
    }

  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  