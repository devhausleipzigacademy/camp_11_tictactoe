import { set } from "react-hook-form";
import "./style.css";

type Symbol = "X" | "O" | null;

class Player {
  name: string;
  symbol: Symbol;
  constructor(_name: string, _symbol: Symbol) {
    this.name = _name;
    this.symbol = _symbol;
  }
}

class Game {
  board: Board;
  boardEl: HTMLElement;
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  isGameOver: boolean;
  constructor(_boardEl: HTMLElement, _player1: Player, _player2: Player) {
    this.board = new Board();
    this.boardEl = _boardEl;
    this.player1 = _player1;
    this.player2 = _player2;
    this.currentPlayer = _player1;
    this.isGameOver = false;
  }

  makeMove(cell: HTMLElement) {
    //console.log(Array.from(this.boardEl.children).indexOf(cell));
    const index = Array.from(this.boardEl.children).indexOf(cell);
    if (!this.board.cells[index]) {
      this.board.cells[index] = this.currentPlayer.symbol;
      cell.innerText = this.currentPlayer.symbol || "";

      this.checkGameStatus();
    }
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkGameStatus() {
    const isWin = this.board.isWin(this.currentPlayer.symbol);
    const isDraw = this.board.isDraw();
    if (isWin) {
      setTimeout(() => {
        alert(`${this.currentPlayer.name} wins! 🎉`);
      }, 0);
      this.isGameOver = true;
      this.resetGame();
      return;
    }
    if (isDraw) {
      setTimeout(() => {
        alert("Is a draw!🤝");
      }, 0);
      this.isGameOver = true;
      this.resetGame();
      return;
    }
    this.switchPlayer();
  }

  resetGame() {
    this.board.resetBoard();
    this.isGameOver = false;
    this.currentPlayer = this.player1;
    Array.from(this.boardEl.children).forEach((cell) => {
      const cellItem = cell as HTMLElement;
      cellItem.innerText = "";
    });
  }
}

class Board {
  cells: Symbol[];
  constructor() {
    this.cells = Array(9).fill(null);
  }

  resetBoard() {
    this.cells.fill(null);
  }

  isWin(symbol: Symbol): boolean {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], //columns
      [0, 4, 8],
      [2, 4, 6], //diagonals
    ];
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return this.cells[index] === symbol;
      });
    });
  }

  isDraw(): boolean {
    return this.cells.every((cell) => cell !== null);
  }

  static createBoard() {
    const board = document.createElement("div");
    board.classList.add("board");
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      board.append(cell);
    }
    return board;
  }
}

class TickTackToe {
  game: Game;

  constructor(_game: Game) {
    this.game = _game;
  }

  start() {
    this.game.boardEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("cell")) {
        this.game.makeMove(target);
      }
    });
  }
}

const appContainer = document.querySelector("#app")!;
const board = Board.createBoard();
appContainer.append(board);

const player1 = new Player("Player 1", "X");
const player2 = new Player("Player 2", "O");

const game = new Game(board, player1, player2);
const tickTackToe = new TickTackToe(game);
tickTackToe.start();
