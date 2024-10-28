import Tile from "../Tile/Tile";
import "./Chessboard.css";

// Define the chessboard axis
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Define a type for chess pieces
interface Piece {
  image: string; // URL to the piece's imag
  x: number; // Horizontal position
  y: number; // Vertical position
}

// Placing pieces on the board. Pices array
const pieces: Piece[] = [];

// Initialize the pieces array with black pawns
for (let i = 0; i < 8; i++) {
  pieces.push({ image: "assets/images/pawn_b.svg", x: i, y: 6 });
}

// Initialize the pieces array with white pawns
for (let i = 0; i < 8; i++) {
  pieces.push({ image: "assets/images/pawn_w.svg", x: i, y: 1 });
}

// White and black piece types
const piecesTypes = ["rook", "knight", "bishop"];
const royalty = ["queen", "king"];

// Add rooks, knights, and bishops for both white and black
piecesTypes.forEach((piece, index) => {
  // White pieces
  pieces.push({ image: `assets/images/${piece}_w.svg`, x: index, y: 0 });
  pieces.push({ image: `assets/images/${piece}_w.svg`, x: 7 - index, y: 0 });

  // Black pieces
  pieces.push({ image: `assets/images/${piece}_b.svg`, x: index, y: 7 });
  pieces.push({ image: `assets/images/${piece}_b.svg`, x: 7 - index, y: 7 });

  // Add queen and king for white and black
  royalty.forEach((piece, index) => {
    // White pieces
    pieces.push({ image: `assets/images/${piece}_w.svg`, x: 3 + index, y: 0 });

    // Black pieces
    pieces.push({ image: `assets/images/${piece}_b.svg`, x: 3 + index, y: 7 });
  });
});

// Chess board function
export default function Chessboard() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    // Loop through each row (from the top)
    for (let i = 0; i < horizontalAxis.length; i++) {
      // Loop through each column
      const number = j + i + 2;
      let image = undefined;

      // Find if there's a piece at the current position
      pieces.forEach((piece) => {
        if (piece.x === i && piece.y === j) image = piece.image;
      });

      board.push(<Tile key={`${j}, ${i}`} image={image} coordinate={number} />);
    }
  }
  return <div id="chessboard">{board}</div>;
}