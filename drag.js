// drag.js
import { renderPieces, showTargetAt, clearTargets, playSound, showBoardAlert } from './display.js';
import { getValidMoves, getPieceById, getPieceAtPosition, isKingInCheck, isCheckmate } from './logic.js';

export function setupDrag(gameState) {
  const board = document.getElementById('board');
  let draggingId   = null;
  let validMoves   = [];

  // Khi bắt đầu kéo
  board.addEventListener('dragstart', e => {
    if (!e.target.classList.contains('piece')) return;
    const id = parseInt(e.target.dataset.id, 10);
    const piece = getPieceById(id, gameState);
    if (!piece || piece.color !== gameState.currentTurn) {
      e.preventDefault();
      return;
    }

    draggingId  = id;
    validMoves  = getValidMoves(piece, gameState);

    // Hiển thị gợi ý di chuyển
    clearTargets();
    validMoves.forEach(m => showTargetAt(m.x, m.y, 'new'));

    // Hiệu ứng nâng
    e.target.classList.add('lifted');
    e.dataTransfer.setData('text/plain', id);
  });

  // Cho phép drop
  board.addEventListener('dragover', e => {
    e.preventDefault();
    if (draggingId === null) return;

    // Tính ô đang hover
    const rect  = board.getBoundingClientRect();
    const x     = Math.floor((e.clientX - rect.left) / 60);
    const y     = Math.floor((e.clientY - rect.top) / 60);
    const ok    = validMoves.some(m => m.x === x && m.y === y);
    board.style.cursor = ok ? 'pointer' : 'not-allowed';
  });

  // Khi thả
  board.addEventListener('drop', e => {
    e.preventDefault();
    if (draggingId === null) return;

    const rect  = board.getBoundingClientRect();
    const x     = Math.floor((e.clientX - rect.left) / 60);
    const y     = Math.floor((e.clientY - rect.top) / 60);
    const piece = getPieceById(draggingId, gameState);
    if (!piece) return;

    // Kiểm tra hợp lệ
    const ok = validMoves.some(m => m.x === x && m.y === y);
    if (!ok) {
      board.style.cursor = 'not-allowed';

      // Xoá hiệu ứng nâng và reset
      const el = document.querySelector(`.piece[data-id='${draggingId}']`);
      if (el) el.classList.remove('lifted');
      
      clearTargets();
      draggingId = null;
      return;
    }

    // Ăn quân nếu có
    const target = getPieceAtPosition(x, y, gameState);
    if (target && target.color !== piece.color) {
      gameState.pieces = gameState.pieces.filter(p => p.id !== target.id);
      playSound('capture');
    } else {
      playSound('move');
    }

    // Lưu cũ, cập nhật vị trí
    const oldX = piece.x, oldY = piece.y;
    piece.x = x; piece.y = y;

    // Vẽ lại với hiệu ứng lastMove
    renderPieces(gameState, piece.id);
    
    // Kiểm tra chiếu tướng
    document.querySelectorAll('.piece').forEach(el => el.classList.remove('shaking'));
    const opponentColor = (gameState.currentTurn === 'red') ? 'black' : 'red';

    if (isKingInCheck(opponentColor, gameState)) {
      if (isCheckmate(opponentColor, gameState)) {
        playSound('checkmate');
        showBoardAlert('checkmate');
      }
      else{
        playSound('check');
        showBoardAlert('check');
        const king = gameState.pieces.find(p => p.type === 'king' && p.color === opponentColor);
        const kingEl = document.querySelector(`.piece[data-id='${king.id}']`);
        if (kingEl) kingEl.classList.add('shaking');
      }
    } else {
      // bỏ rung
      document.querySelectorAll('.piece').forEach(el => el.classList.remove('shaking'));
    }

    // Xóa hết gợi ý cũ rồi show target-old/new
    clearTargets();
    showTargetAt(oldX, oldY, 'old');
    showTargetAt(x, y, 'new');

    // Đổi lượt
    gameState.currentTurn = (gameState.currentTurn === 'red') ? 'black' : 'red';

    
    // Reset
    draggingId = null;
    board.style.cursor = 'default';
  });

  // Khi kết thúc kéo (nếu hủy giữa chừng)
  board.addEventListener('dragend', e => {
    if (draggingId !== null) {
      clearTargets();
      e.target.classList.remove('lifted');
      draggingId = null;
      board.style.cursor = 'default';
    }
  });
}
