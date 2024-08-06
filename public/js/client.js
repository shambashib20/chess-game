const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;


const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    console.log(board);
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === 'w' ? 'white' : 'black'
                );
                pieceElement.innerText = "";
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", () => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, column: columnIndex };
                        e.dataTransfer.setDeata("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragged", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                square.appendChild(pieceElement);

            }
        })
    })
};


const handleMove = () => {

}


const getPieceUnicode = () => {

}

renderBoard();
