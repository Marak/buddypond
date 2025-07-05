export default class ChessApp {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.options = options;
    this.board = null;
    this.game = null;
    this.ws = null;
    this.playerColor = null;
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/chess/chess.html');
    alert(this.html);
    //   <script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.js"></script>
    //  <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js"></script>
    //   <link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
    await this.bp.appendScript('https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.js');
    await this.bp.appendScript('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js');
    await this.bp.appendCSS('https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css');

    //await this.bp.load('/v5/apps/chess/chess.css');
    return 'loaded ChessApp';
  }

  async open() {
    this.win = this.bp.apps.ui.windowManager.createWindow({
      id: 'chess-app',
      title: 'BuddyPond Chess',
      icon: 'desktop/assets/images/icons/icon_console_64.png',
      x: 120,
      y: 80,
      width: 600,
      height: 600,
      content: this.html,
      resizable: true,
      closable: true,
      onclose: () => this.cleanup()
    });

    this.bindUI();
    return this.win;
  }

  bindUI() {
    $('#join-game').on('click', () => this.joinGame());
    this.game = new Chess();
    let board = $('#chessboard', this.win.content);
    console.log('Initializing chessboard', board);
    this.board = Chessboard(board, {
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)
    });
    this.updateStatus();
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
    if (this.playerColor && piece[0] !== this.playerColor) return false;
    if (this.game.turn() !== this.playerColor) return false;
    return true;
  }

  onDrop(source, target) {
    const move = this.game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'move',
        gameId: document.getElementById('game-input').value,
        move: { from: source, to: target, promotion: 'q' }
      }));
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
  }
} 