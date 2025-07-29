export function initGameState() {
  return {
    pieces: [
      { id: 0, type: 'king', color: 'black', x: 4, y: 0 },
      { id: 1, type: 'king', color: 'red', x: 4, y: 9 },
      { id: 2, type: 'advisor', color: 'black', x: 3, y: 0},
      { id: 3, type: 'advisor', color: 'black', x: 5, y: 0},
      { id: 4, type: 'advisor', color: 'red', x: 3, y: 9},
      { id: 5, type: 'advisor', color: 'red', x: 5, y: 9},
      { id: 6, type: 'elephant', color: 'black', x: 2, y: 0},
      { id: 7, type: 'elephant', color: 'black', x: 6, y: 0},
      { id: 8, type: 'elephant', color: 'red', x: 2, y: 9},
      { id: 9, type: 'elephant', color: 'red', x: 6, y: 9},
      { id: 10, type: 'horse', color: 'black', x: 1, y: 0},
      { id: 11, type: 'horse', color: 'black', x: 7, y: 0},
      { id: 12, type: 'horse', color: 'red', x: 1, y: 9},
      { id: 13, type: 'horse', color: 'red', x: 7, y: 9},
      { id: 14, type: 'chariot', color: 'black', x: 0, y: 0},
      { id: 15, type: 'chariot', color: 'black', x: 8, y: 0},
      { id: 16, type: 'chariot', color: 'red', x: 0, y: 9},
      { id: 17, type: 'chariot', color: 'red', x: 8, y: 9},
      { id: 18, type: 'cannon', color: 'black', x: 1, y: 2},
      { id: 19, type: 'cannon', color: 'black', x: 7, y: 2},
      { id: 20, type: 'cannon', color: 'red', x: 1, y: 7},
      { id: 21, type: 'cannon', color: 'red', x: 7, y: 7},
      { id: 22, type: 'soldier', color: 'black', x: 0, y: 3},
      { id: 23, type: 'soldier', color: 'black', x: 2, y: 3},
      { id: 24, type: 'soldier', color: 'black', x: 4, y: 3},
      { id: 25, type: 'soldier', color: 'black', x: 6, y: 3},
      { id: 26, type: 'soldier', color: 'black', x: 8, y: 3},
      { id: 27, type: 'soldier', color: 'red', x: 0, y: 6},
      { id: 28, type: 'soldier', color: 'red', x: 2, y: 6},
      { id: 29, type: 'soldier', color: 'red', x: 4, y: 6},
      { id: 30, type: 'soldier', color: 'red', x: 6, y: 6},
      { id: 31, type: 'soldier', color: 'red', x: 8, y: 6},
    ],
    currentTurn: 'red'
  };
}

export function getValidMoves(piece, gameState, ignoreSelfCheck = false) {
  const moves = getAttackMoves(piece, gameState);

  if (ignoreSelfCheck) return moves;

  // Lọc nước khiến tướng bị chiếu
  return moves.filter(m => simulateMoveAndCheck(piece, m, gameState));
}

function getAttackMoves(piece, gameState) {
  switch (piece.type){
    case 'king': return getKingMoves(piece, gameState);
    case 'advisor': return getAdvisorMoves(piece, gameState);
    case 'elephant': return getElephantMoves(piece, gameState);
    case 'horse': return getHorseMoves(piece, gameState);
    case 'chariot': return getChariotMoves(piece, gameState);
    case 'cannon': return getCannonMoves(piece, gameState);
    case 'soldier': return getSoldierMoves(piece, gameState);
    default: return [];
  }
}

// Trả về quân cờ tại vị trí (x, y) nếu có, ngược lại trả về null
export function getPieceAtPosition(x, y, gameState) {
  return gameState.pieces.find(p => p.x === x && p.y === y) || null;
}

// Trả về quân cờ theo id nếu có
export function getPieceById(id, gameState) {
  return gameState.pieces.find(p => p.id === id) || null;
}

export function isEmptyOrOpponent(x, y, color, gameState){
  if(x < 0 || x > 8 || y < 0 || y > 9) return false;

  const target = gameState.pieces.find(p => p.x === x && p.y === y);
  return !target || target.color !== color;
}

function hasPieceAt(x, y, gameState) {
  return gameState.pieces.some(p => p.x === x && p.y === y);
}

export function getSoldierMoves(piece, gameState) {
  const moves = [];
  const { x: px, y: py, color } = piece;

  // Với thế trận: Black ở hàng 0–4 (top), Red ở hàng 5–9 (bottom).
  // Black tiến xuống dưới (dy = +1), Red tiến lên trên (dy = -1).
  const forwardDy = (color === 'black') ? +1 : -1;

  // 1) Luôn luôn có thể đi 1 ô về phía trước
  const fx = px;
  const fy = py + forwardDy;
  if (fy >= 0 && fy <= 9) {
    const target = getPieceAtPosition(fx, fy, gameState);
    if (!target || target.color !== color) {
      moves.push({ x: fx, y: fy });
    }
  }

  // 2) Sau khi đã qua sông (Black: py >= 5; Red: py <= 4), cho phép đi ngang
  const crossedRiver = (color === 'black') ? (py >= 5) : (py <= 4);
  if (crossedRiver) {
    // qua trái
    const lx = px - 1, ly = py;
    if (lx >= 0) {
      const targetL = getPieceAtPosition(lx, ly, gameState);
      if (!targetL || targetL.color !== color) {
        moves.push({ x: lx, y: ly });
      }
    }
    // qua phải
    const rx = px + 1, ry = py;
    if (rx <= 8) {
      const targetR = getPieceAtPosition(rx, ry, gameState);
      if (!targetR || targetR.color !== color) {
        moves.push({ x: rx, y: ry });
      }
    }
  }

  return moves;
}

function getCannonMoves(piece, gameState){
  const moves = [];

  if(piece.type === 'cannon') {
    const directions = [
      { dx: 1, dy: 0 },  // Phải
      { dx: -1, dy: 0 }, // Trái
      { dx: 0, dy: 1 },  // Xuống
      { dx: 0, dy: -1 }  // Lên
    ];

    directions.forEach(({dx, dy, }) => {
      let x = piece.x + dx;
      let y = piece.y + dy;
      let jumped = false; // Biến check quân cản

      while (x >= 0 && x <= 8 && y >= 0 && y <= 9) {
        const target = gameState.pieces.find(p => p.x === x && p.y === y);
        
        if (!jumped) {
          if (!target) {
            moves.push({ x, y }); // Di chuyển bình thường như Xe
          } else {
            jumped = true; // Gặp quân cản, bắt đầu tìm quân bị ăn
          }
        } else {
          if (target) {
            if (target.color !== piece.color) {
              moves.push({ x, y }); // Có đúng 1 quân cản và đây là quân địch
            }
            break; // Dừng lại sau khi gặp quân thứ 2
          }
        }

        x += dx;
        y += dy;
      }
    });
  }

  return moves;
}

export function getHorseMoves(piece, gameState) {
  const moves = [];
  const x = piece.x;
  const y = piece.y;

  // Tất cả các hướng di chuyển có thể xảy ra của quân mã với kiểm tra "chặn ngựa" bị chặn
  const directions = [
    { legX: 0, legY: -1, dx: -1, dy: -2 }, // Trên trái
    { legX: 0, legY: -1, dx: 1, dy: -2 },  // Trên phải
    { legX: 0, legY: 1, dx: -1, dy: 2 },   // Dưới trái
    { legX: 0, legY: 1, dx: 1, dy: 2 },    // Dưới phải
    { legX: -1, legY: 0, dx: -2, dy: -1 }, // Trái trên
    { legX: -1, legY: 0, dx: -2, dy: 1 },  // Trái dưới
    { legX: 1, legY: 0, dx: 2, dy: -1 },   // Phải trên
    { legX: 1, legY: 0, dx: 2, dy: 1 }     // Phải dưới
  ];

  for(const dir of directions) {
    const legX = x + dir.legX;
    const legY = y + dir.legY;
    const targetX = x + dir.dx;
    const targetY = y + dir.dy;

    // Nếu "chân ngựa" không bị chặn và ô đến nằm trong bàn cờ
    if (!hasPieceAt(legX, legY, gameState) &&
        targetX >= 0 && targetX <= 8 &&
        targetY >= 0 && targetY <= 9 &&
        isEmptyOrOpponent(targetX, targetY, piece.color, gameState)) {
      moves.push({ x: targetX, y: targetY });
    }
  }

  return moves;
}

export function getChariotMoves(piece, gameState) {
  const moves = [];
  const directions = [
    { dx:  1, dy:  0 },  // sang phải
    { dx: -1, dy:  0 },  // sang trái
    { dx:  0, dy:  1 },  // xuống
    { dx:  0, dy: -1 }   // lên
  ];

  for (const { dx, dy } of directions) {
    let step = 1;
    while (true) {
      const x = piece.x + dx * step;
      const y = piece.y + dy * step;
      // ra khỏi bàn cờ thì dừng
      if (x < 0 || x > 8 || y < 0 || y > 9) break;

      const target = getPieceAtPosition(x, y, gameState);
      if (!target) {
        // ô trống → có thể đi tiếp
        moves.push({ x, y });
        step++;
      } else {
        // có quân ở đó
        if (target.color !== piece.color) {
          // quân đối phương → có thể ăn, rồi dừng
          moves.push({ x, y });
        }
        // dù ăn hay gặp cùng phe, đều dừng hướng này
        break;
      }
    }
  }

  return moves;
}

export function getKingMoves(piece, gameState) {
  const moves = [];
  const { x: px, y: py, color } = piece;

  // 4 hướng: phải, trái, xuống, lên
  const deltas = [
    { dx:  1, dy:  0 },
    { dx: -1, dy:  0 },
    { dx:  0, dy:  1 },
    { dx:  0, dy: -1 },
  ];

  // Phạm vi cung tùy theo màu
  const minX = 3, maxX = 5;
  const [minY, maxY] = (color === 'red') ? [7, 9] : [0, 2];

  for (const { dx, dy } of deltas) {
    const x = px + dx;
    const y = py + dy;

    // Bắt buộc trong cung
    if (x < minX || x > maxX || y < minY || y > maxY) continue;

    const target = getPieceAtPosition(x, y, gameState);
    if (!target) {
      // ô trống → đi được
      moves.push({ x, y });
    } else if (target.color !== color) {
      // ô có quân địch → ăn được
      moves.push({ x, y });
    }
    // nếu gặp quân cùng phe → không thêm
  }

  return moves;
}

export function getElephantMoves(piece, gameState) {
  const moves = [];
  const { x: px, y: py, color } = piece;

  // 4 hướng chéo 2 ô
  const deltas = [
    { dx:  2, dy:  2 },
    { dx: -2, dy:  2 },
    { dx:  2, dy: -2 },
    { dx: -2, dy: -2 },
  ];

  for (const { dx, dy } of deltas) {
    const eyeX = px + dx / 2;
    const eyeY = py + dy / 2;
    const tx   = px + dx;
    const ty   = py + dy;

    // 1) Không nhảy qua “mắt tượng”
    if (getPieceAtPosition(eyeX, eyeY, gameState)) continue;

    // 2) Trong bàn (0 ≤ x ≤ 8, 0 ≤ y ≤ 9)
    if (tx < 0 || tx > 8 || ty < 0 || ty > 9) continue;

    // 3) Không vượt sông (theo thế trận mới)
    if (color === 'black' && ty > 4) continue;  // Đen chỉ y ≤ 4
    if (color === 'red'   && ty < 5) continue;  // Đỏ chỉ y ≥ 5

    // 4) Nếu ô đích trống hoặc có quân địch → thêm nước đi
    const target = getPieceAtPosition(tx, ty, gameState);
    if (!target || target.color !== color) {
      moves.push({ x: tx, y: ty });
    }
  }

  return moves;
}

export function getAdvisorMoves(piece, gameState) {
  const moves = [];
  const { x: px, y: py, color } = piece;

  // 4 hướng chéo 1 ô
  const deltas = [
    { dx:  1, dy:  1 },
    { dx: -1, dy:  1 },
    { dx:  1, dy: -1 },
    { dx: -1, dy: -1 },
  ];

  for (const { dx, dy } of deltas) {
    const tx = px + dx;
    const ty = py + dy;

    // 1) Trong bàn 9×10
    if (tx < 0 || tx > 8 || ty < 0 || ty > 9) continue;

    // 2) Phải trong cung (palace)
    const inPalaceX = tx >= 3 && tx <= 5;
    const inPalaceY = (color === 'black')
      ? (ty >= 0 && ty <= 2)   // Đen ở nửa trên
      : (ty >= 7 && ty <= 9);  // Đỏ ở nửa dưới
    if (!inPalaceX || !inPalaceY) continue;

    // 3) Nếu ô trống hoặc có quân địch → thêm
    const target = getPieceAtPosition(tx, ty, gameState);
    if (!target || target.color !== color) {
      moves.push({ x: tx, y: ty });
    }
  }

  return moves;
}

// --- Các hàm phụ trợ để kiểm tra chiếu tướng ---

export function getAllMoves(color, gameState) {
  const pieces = gameState.pieces.filter(p => p.color === color);
  let allMoves = [];
  for (const piece of pieces) {
    const moves = getValidMoves(piece, gameState);
    allMoves = allMoves.concat(moves.map(m => ({piece, ...m})));
  }
  return allMoves;
}

export function isKingInCheck(color, gameState) {
  const king = gameState.pieces.find(p => p.type === 'king' && p.color === color);
  if (!king) return false;

  const opponentColor = (color === 'red') ? 'black' : 'red';
  const opponentPieces = gameState.pieces.filter(p => p.color === opponentColor);

  for (const p of opponentPieces) {
    const moves = getAttackMoves(p, gameState); // KHÔNG gọi simulateMoveAndCheck
    if (moves.some(m => m.x === king.x && m.y === king.y)) {
      return true;
    }
  }
  return false;
}


export function isCheckmate(color, gameState) {
  // Nếu không bị chiếu thì chắc chắn không chiếu hết
  if (!isKingInCheck(color, gameState)) return false;

  // Lấy tất cả quân của color
  const pieces = gameState.pieces.filter(p => p.color === color);

  for (const piece of pieces) {
    const validMoves = getValidMoves(piece, gameState, false);
    for (const move of validMoves) {
      const oldX = piece.x, oldY = piece.y;
      const captured = getPieceAtPosition(move.x, move.y, gameState);
      if (captured) gameState.pieces = gameState.pieces.filter(p => p.id !== captured.id);

      piece.x = move.x; piece.y = move.y;
      const stillCheck = isKingInCheck(color, gameState);

      // Hoàn tác
      piece.x = oldX; piece.y = oldY;
      if (captured) gameState.pieces.push(captured);

      // Nếu có ít nhất một nước thoát chiếu
      if (!stillCheck) return false;
    }
  }

  return true;
}


function simulateMoveAndCheck(piece, move, gameState) {
  const oldX = piece.x, oldY = piece.y;
  const captured = getPieceAtPosition(move.x, move.y, gameState);

  piece.x = move.x; piece.y = move.y;
  if (captured) gameState.pieces = gameState.pieces.filter(p => p.id !== captured.id);

  const inCheck = isKingInCheck(piece.color, gameState);

  piece.x = oldX; piece.y = oldY;
  if (captured) gameState.pieces.push(captured);

  return !inCheck;
}

