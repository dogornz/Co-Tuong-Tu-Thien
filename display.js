
// Vẽ bàn cờ vào #board
export function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Xoá nội dung cũ

    const bg = document.createElement('img');
    bg.src = 'assets/board.png';
    bg.id = 'board-img';
    bg.style.position = 'absolute';
    bg.style.width = '100%';
    bg.style.height = '100%';

    board.appendChild(bg);

    
    // Thêm lại #board-alert sau khi xóa
    const alertDiv = document.createElement('div');
    alertDiv.id = 'board-alert';
    const alertImg = document.createElement('img');
    alertImg.id = 'board-alert-img';
    alertImg.alt = 'alert';
    alertDiv.appendChild(alertImg);
    board.appendChild(alertDiv);
}

// Vẽ tât cả quân cờ dựa trên gameState.pieces
export function renderPieces(gameState, lastMoveId = null) {

    board.querySelectorAll('.piece-wrapper').forEach(el=>el.remove());
    
    // Xoá các quân cờ cũ (chừa lại background board)
    const oldPieces = board.querySelectorAll('.piece');
    oldPieces.forEach(el => el.remove());

    gameState.pieces.forEach(piece => {
        const wrapper = document.createElement('div');
        wrapper.className = 'piece-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${piece.x * 60 + 30 - 30}px`;
        wrapper.style.top = `${piece.y * 60 + 30 - 30}px`;
        wrapper.style.zIndex = 1;
        wrapper.dataset.id = piece.id;

        const shadow = document.createElement('img');
        shadow.src = `assets/${piece.type}_${piece.color}.png`;
        shadow.className = 'piece shadow';
        // Quân cờ
        const img = document.createElement('img');
        img.src = `assets/${piece.type}_${piece.color}.png`;
        img.className = 'piece';
        img.style.zIndex = 2;
        img.dataset.id = piece.id; // Lưu id để nhận diện

        // Tính toán vị trí pixel
        const x = piece.x * 60 + 30 - 30; // Ô x * kích thước ô + offset - nửa kích thước ô
        const y = piece.y * 60 + 30 - 30; // Ô y * kích thước ô + offset - nửa kích thước ô
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.cursor = 'pointer';

        if(piece.id === lastMoveId) {
            img.classList.add('piece-animate');
        }

        wrapper.appendChild(img);
        board.appendChild(wrapper);
        board.appendChild(img);
    });
}

// Xoá tất cả target
export function clearTargets(){
    document.querySelectorAll('.turn-target').forEach(el => el.remove());
}

// Tạo ảnh target tại (x, y) trên lưới
export function showTargetAt(gridX, gridY, type = 'new'){
    const cellSize = 60;
    const offsetBoardX = 30;
    const offsetBoardY = 30;

    const board = document.getElementById('board');
    
    const img = document.createElement('img');
    img.src = type === 'old' ? 'assets/target-old.png' : 'assets/target-new.png';
    img.className = 'target-img turn-target';
    img.style.position = 'absolute';
    img.style.width = `${cellSize}px`;
    img.style.height = `${cellSize}px`;
    img.style.left = `${gridX * cellSize + offsetBoardX - cellSize / 2}px`;
    img.style.top = `${gridY * cellSize + offsetBoardY - cellSize / 2}px`;
    img.style.pointerEvents = 'none';
    img.style.zIndex = '2';

    board.appendChild(img);
}

export function playSound(type) {
  let audioPath = '';
  switch(type) {
    case 'move':
      audioPath = 'audio/move.mp3';
      break;
    case 'capture':
      audioPath = 'audio/capture.mp3';
      break;
    case 'check':
      audioPath = 'audio/check.mp3';
      break;
    case 'checkmate':
      audioPath = 'audio/checkmate.mp3';
      break;
  }
  if (audioPath) {
    const audio = new Audio(audioPath);
    audio.play();
  }
}

export function showBoardAlert(type) {
  const overlay = document.getElementById('board-alert');
  const img = document.getElementById('board-alert-img');

  img.src = type === 'check' ? 'assets/check.png' : 'assets/checkmate.png';
  overlay.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 1800); // 1.8 giây
}

