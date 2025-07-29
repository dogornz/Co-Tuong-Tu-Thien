import { initGameState } from './logic.js';
import { renderBoard, renderPieces } from './display.js';
import { setupDrag } from './drag.js';
import { setupClickMove } from './click.js';
document.addEventListener('DOMContentLoaded', () => {
    const gameState = initGameState();
    renderBoard();
    renderPieces(gameState);

    setupDrag(gameState);
    setupClickMove(gameState);
});
