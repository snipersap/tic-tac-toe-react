import React from "react";
import ReactDOM from "react-dom";
import './index.css';

/* SQUARE Component */
  function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  /* BOARD Component */
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            key = {i}
            value={this.props.squares[i]} 
            onClick={() => {this.props.onClick(i)}}
        />
      );
    }

    buildTable() {
    /*Add the rows to form the table*/       
      const squares = [];
      for(let j = 0, index = 0; j < 3; j++, index+=3){
        squares.push(this.buildRows(index));
      }
      return <div>{squares}</div>
    }

    buildRows(index) {
      /*Create an array to hold the indexes of all the squares
      const squareTable = Array.from({length: 9}, (value, index) => index);
      console.log(squareTable);*/
        const rows = [];
        for(let i = 0; i < 3; i++, index++) {
            rows.push(this.renderSquare(index));
        }
        return <div key={index} className="board-row">{rows}</div>; 
    }

    render() {     
      return (
        <div>
          <div className="status">{/* status */}</div>
          {/*<div className="board-row">
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
          </div>*/}
          {this.buildTable()}
        </div>
      );
    }
  }
  
  /* GAME Component */
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
        squareMoves : Array(10).fill(null),
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

    getPlayerMovePositions(i) {
      const squareMoves = this.state.squareMoves.slice(0,this.state.moveNumber + 1);
      squareMoves[this.state.moveNumber+1] = i;
      return squareMoves;
    }

    handleClick(i) {
        let squaresSlice = this.continuGame(i);
        if(!squaresSlice) return;
        
        squaresSlice[i] = this.getPlayerMove();
        const squareMoves = this.getPlayerMovePositions(i);
        const winner = calculateWinner(squaresSlice);
        const history = this.state.history.slice(0,this.state.moveNumber + 1);
        this.setState({
          history: history.concat([{
            squares: squaresSlice,
          }]),
          moveNumber: history.length,
          xIsNext: !this.state.xIsNext,
          winner: winner,
          squareMoves: squareMoves,
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

    getSquarePosition(moveNumber) {
      const squareMoves = this.state.squareMoves.slice();
      const indexOfTablePosition = squareMoves[moveNumber];
      const squarePosition = getTablePosition(indexOfTablePosition);
      return squarePosition;
    }  

    getMoves() {
      const history = this.state.history;
      /* map(current array value, current array index) */
      const moves = history.map((step, move) => {
        const squarePosition = this.getSquarePosition(move);
        const isBold = (move == this.state.moveNumber)? "liBold" : null;
        const desc = move ? 'Go to move #' + move + squarePosition : 'Go to game start, i.e. move #' + move;
        return(
          <li key={move} >
            <button className = {isBold} onClick={() => this.jumpTo(move)}>{desc}</button>
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

  /* HELPER function */
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

  function getTablePosition(squareIndex){
    const tablePositions = [
      '(0,0)',
      '(0,1)',
      '(0,2)',
      '(1,0)',
      '(1,1)',
      '(1,2)',
      '(2,0)',
      '(2,1)',
      '(2,2)',
    ];
    return tablePositions[squareIndex];
  }

  
  // ========================================
  /* Render GAME Component */

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  