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
    board.forEach((row, rowindex) => {
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === 'w' ? 'white' : 'black'
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowindex, col: squareindex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);

            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSource)
                }
            });
            boardElement.appendChild(squareElement);
        });
    });
};


const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q' // Assuming a promotion is possible for a pawn reaching the last rank
    };

    const result = chess.move(move);
    console.log(result);
    if (result) {
        renderBoard();
        socket.emit("move", move);
    } else {
        console.log("Invalid move");
    }
}


const getPieceUnicode = (piece) => {
    const unicodePieces = {

        k: "\u2654", // White King
        q: "\u2655", // White Queen
        r: "\u2656", // White Rook
        b: "\u2657", // White Bishop
        n: "\u2658", // White Knight
        p: "\u2659", // White Pawn

        K: "\u265A", // Black King
        Q: "\u265B", // Black Queen
        R: "\u265C", // Black Rook
        B: "\u265D", // Black Bishop
        N: "\u265E", // Black Knight
        P: "\u265F", // Black Pawn
    };

    return unicodePieces[piece.type] || "";
};


socket.on("playerRole", function (role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", function () {
    playerRole = null;
    renderBoard();
});


socket.on("boardState", function (fen) {
    chess.load(fen);
    renderBoard();
});


socket.on("move", function (move) {
    chess.move(move);
    renderBoard();
})
renderBoard();
