// click.js
import { renderPieces, showTargetAt, clearTargets, playSound, showBoardAlert } from './display.js';
import { getValidMoves, getPieceById, getPieceAtPosition, isKingInCheck, isCheckmate } from './logic.js';

export function setupClickMove(gameState) {
  const board      = document.getElementById('board');
  let selectedId   = null;

  board.addEventListener('click', (e) => {
    const rect  = board.getBoundingClientRect();
    const x     = Math.floor((e.clientX - rect.left) / 60);
    const y     = Math.floor((e.clientY - rect.top) / 60);

    // 1) Nếu đang có quân được chọn → thử di chuyển hoặc ăn
    if (selectedId !== null) {
      const piece = getPieceById(selectedId, gameState);
      if (piece) {
        // Kiểm tra xem (x,y) có phải move hợp lệ không
        const moves = getValidMoves(piece, gameState);
        const isValid = moves.some(m => m.x === x && m.y === y);
        if (isValid) {
          // Ăn quân nếu có
          const target = getPieceAtPosition(x, y, gameState);
          if (target && target.color !== piece.color) {
            gameState.pieces = gameState.pieces.filter(p => p.id !== target.id);
            playSound('capture');
          } else {
            playSound('move');
          }
          // Lưu vị trí cũ
          const oldX = piece.x, oldY = piece.y;
          // Cập nhật vị trí
          piece.x = x; piece.y = y;

          // Vẽ lại với hiệu ứng last-move
          renderPieces(gameState, piece.id);
          
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
              // rung tướng
              const king = gameState.pieces.find(p => p.type === 'king' && p.color === opponentColor);
              const kingEl = document.querySelector(`.piece[data-id='${king.id}']`);
              if (kingEl) kingEl.classList.add('shaking');
            }
          } else {
            // bỏ rung
            document.querySelectorAll('.piece').forEach(el => el.classList.remove('shaking'));
          }
          
          // Đổi lượt
          gameState.currentTurn = (gameState.currentTurn === 'red') ? 'black' : 'red';

          // Xóa gợi ý & target cũ, rồi show target-old/new
          clearTargets();
          showTargetAt(oldX, oldY, 'old');
          showTargetAt(x, y, 'new');

          


          // Reset selected
          selectedId = null;
          board.style.cursor = 'default';
          return;
        }
      }
    }

    // 2) Nếu click vào quân của mình → chọn và show gợi ý
    if (e.target.classList.contains('piece')) {
      const id    = parseInt(e.target.dataset.id, 10);
      const piece = getPieceById(id, gameState);
      if (!piece || piece.color !== gameState.currentTurn) {
        board.style.cursor = 'not-allowed';
        return;
      }

      // Chọn quân, clear các gợi ý cũ, show gợi ý mới
      selectedId = id;
      clearTargets();
      const moves = getValidMoves(piece, gameState);
      moves.forEach(m => showTargetAt(m.x, m.y, 'new'));

      // Hiệu ứng “nhấc”
      document.querySelectorAll('.piece').forEach(el => el.classList.remove('lifted'));
      e.target.classList.add('lifted');
      return;
    }

    // 3) Click lung tung (ô trống hoặc ô không hợp lệ) → reset
    selectedId = null;
    clearTargets();
    document.querySelectorAll('.piece').forEach(el => el.classList.remove('lifted'));
    board.style.cursor = 'default';
  });
}
