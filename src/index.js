import React from "react";
import ReactDOM from "react-dom";
import './index.css';


  function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]} 
            onClick={() => {this.props.onClick(i)}}
        />
      );
    }

    render() {     
      return (
        <div>
          <div className="status">{/* status */}</div>
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
        moveNumber: 0,
        xIsNext: true,
        winner: null,
      };
    }
    
    continuGame(i) {
      const history = this.state.history.slice(0,this.state.moveNumber + 1);
      const current = history[history.length - 1];
      const squaresSlice = current.squares.slice();
      if(this.state.winner || squaresSlice[i]){
        return false; 
      }
      return squaresSlice;
    }

    getPlayerMove() {
      return this.state.xIsNext ? 'X' : 'O';
    }

    handleClick(i) {
        let squaresSlice = this.continuGame(i);
        if(!squaresSlice) return;
        
        squaresSlice[i] = this.getPlayerMove();
        const winner = calculateWinner(squaresSlice);
        const history = this.state.history.slice(0,this.state.moveNumber + 1);
        this.setState({
          history: history.concat([{
            squares: squaresSlice,
          }]),
          moveNumber: history.length,
          xIsNext: !this.state.xIsNext,
          winner: winner,
        });

    }

    getStatus() {
      let gameStatus;
      if(this.state.winner) {
        gameStatus = 'Winner: ' + this.state.winner;
      } else {
        gameStatus = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return gameStatus;  
    }

    jumpTo(move) {
      this.setState({
        moveNumber: move,
        xIsNext: isMoveEven(),
      });

      function isMoveEven() {
        return (move % 2) === 0;
      }
    }

    getMoves() {
      const history = this.state.history;
      /* map(current array value, current array index) */
      const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move : 'Go to game start, i.e. move #' + move;
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        ); 
      });
      return moves;
    }
    
    render() {
      const history = this.state.history;
      const current = history[this.state.moveNumber];
      let status = this.getStatus();
      let moves = this.getMoves( );

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i) => {
                return this.handleClick(i);
              }}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ol>{ moves }</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares){
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for(let i = 0; i < lines.length; i++) {
      const[a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
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
  