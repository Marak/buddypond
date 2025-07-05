export default class ChessApp {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.options = options;
    this.board = null;
    this.game = null;
    this.ws = null;
    this.playerColor = null;
    this.stockfish = null;
    this.mode = 'multiplayer'; // or 'stockfish'
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/chess/chess.html');
    await this.bp.appendScript('https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.js');
    await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js');
    await this.bp.appendScript('/v5/apps/based/chess/vendor/stockfish.min.js');
    await this.bp.appendCSS('https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css');
    return 'loaded ChessApp';
  }

  async open() {
    this.win = await this.bp.window(this.window());
    this.bindUI();
    // for now
    this.mode = 'stockfish';

     this.startStockfishGame();

    return this.win;
  } 

  window () {
    return {
      id: 'chess',
      title: 'BuddyPond Chess',
      icon: 'desktop/assets/images/icons/icon_chess_64.png',
      x: 120,
      y: 80,
      width: 600,
      height: 600,
      content: this.html,
      resizable: true,
      closable: true,
      onClose: () => this.cleanup()
    }
  }

  bindUI() {
    $('#join-game').on('click', () => {
      this.mode = 'multiplayer';
      this.joinGame();
    });

    $('#play-stockfish').on('click', () => {
      this.mode = 'stockfish';
      this.startStockfishGame();
    });

    this.game = new Chess();
    let board = $('#chessboard', this.win.content);
    this.board = Chessboard(board, {
      pieceTheme: '/v5/apps/based/chess/img/chesspieces/wikipedia/{piece}.png',
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });

    this.updateStatus();
  }

  startStockfishGame() {
    this.game.reset();
    this.board.position('start');
    this.playerColor = 'w';
    this.setStatus('You are White. Make your move.');
    // getting a same origin error here, do we need to vendor the dep on our site?
    this.stockfish = new Worker('v5/apps/based/chess/vendor/stockfish.min.js');
    this.stockfish.onmessage = (e) => {
      if (typeof e.data === 'string' && e.data.startsWith('bestmove')) {
        const move = e.data.split(' ')[1];
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const result = this.game.move({ from, to, promotion: 'q' });
        if (result) {
          this.board.position(this.game.fen());
          this.updateStatus();
        }
      }
    };
  }

  joinGame() {
    const gameId = document.getElementById('game-input').value.trim();
    if (!gameId) return alert('Please enter a game ID');

    const endpoint = 'ws://192.168.200.59:5556/ws/game/' + gameId;
    this.ws = new WebSocket(endpoint);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({ type: 'join', gameId }));
      this.setStatus('Connected! Waiting for opponent...');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'color') {
        this.playerColor = data.color;
        this.board.orientation(this.playerColor === 'w' ? 'white' : 'black');
        this.setStatus(`You are ${this.playerColor === 'w' ? 'White' : 'Black'}. ${this.game.turn() === 'w' ? 'White' : 'Black'} to move.`);
      } else if (data.type === 'move') {
        const move = this.game.move(data.move);
        if (move) {
          this.board.position(this.game.fen());
          this.updateStatus();
        }
      } else if (data.type === 'gameStart') {
        this.setStatus('Game started! ' + (this.playerColor === this.game.turn() ? 'Your move' : 'Opponent\'s move'));
      } else if (data.type === 'error') {
        this.setStatus('Error: ' + data.message);
      }
    };

    this.ws.onclose = () => this.setStatus('Disconnected from game');
    this.ws.onerror = () => this.setStatus('WebSocket error occurred');
  }

  onDragStart(source, piece) {
    if (this.game.game_over()) return false;
    if (this.mode === 'multiplayer') {
      if (this.playerColor && piece[0] !== this.playerColor) return false;
      if (this.game.turn() !== this.playerColor) return false;
    } else if (this.mode === 'stockfish') {
      if (this.game.turn() !== 'w') return false;
    }
    return true;
  }

  onDrop(source, target) {
    const move = this.game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    if (this.mode === 'multiplayer' && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'move',
        gameId: document.getElementById('game-input').value,
        move: { from: source, to: target, promotion: 'q' }
      }));
    } else if (this.mode === 'stockfish') {
      setTimeout(() => {
        this.stockfish.postMessage('position fen ' + this.game.fen());
        this.stockfish.postMessage('go depth 15');
      }, 200);
    }

    this.updateStatus();
  }

  onSnapEnd() {
    this.board.position(this.game.fen());
  }

  updateStatus() {
    let status = '';
    if (this.game.in_checkmate()) {
      status = 'Checkmate! ' + (this.game.turn() === 'w' ? 'Black' : 'White') + ' wins!';
    } else if (this.game.in_draw()) {
      status = 'Game Over: Draw!';
    } else {
      status = (this.game.turn() === 'w' ? 'White' : 'Black') + ' to move';
    }
    this.setStatus(status);
  }

  setStatus(message) {
    document.getElementById('status').textContent = message;
  }

  cleanup() {
    if (this.ws) this.ws.close();
    if (this.stockfish) {
      this.stockfish.terminate();
      this.stockfish = null;
    }
  }
}
