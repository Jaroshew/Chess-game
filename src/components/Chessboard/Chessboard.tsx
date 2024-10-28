import React, { useEffect, useRef } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import { Z_ASCII } from "zlib";

// Define the chessboard axis
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Chess piece type definition
interface Piece {
  image: string;
  x: number;
  y: number;
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
  pieces.push({ image: `assets/images/${piece}_w.svg`, x: index, y: 0 });
  pieces.push({ image: `assets/images/${piece}_w.svg`, x: 7 - index, y: 0 });

  pieces.push({ image: `assets/images/${piece}_b.svg`, x: index, y: 7 });
  pieces.push({ image: `assets/images/${piece}_b.svg`, x: 7 - index, y: 7 });

  // Add queen and king for white and black
  royalty.forEach((piece, index) => {
    pieces.push({ image: `assets/images/${piece}_w.svg`, x: 3 + index, y: 0 });
    pieces.push({ image: `assets/images/${piece}_b.svg`, x: 3 + index, y: 7 });
  });
});

// Chess board function
export default function Chessboard() {
  const chessBoardRef = useRef<HTMLDivElement>(null);
  let board = [];
  let activePiece: HTMLElement | null = null;

  // Function to grab a piece
  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains("chess-piece")) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activePiece = element;
    }
  }

  // Function to move a piece
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessBoardRef.current;
    if (activePiece && chessboard) {
      const pieceWidth = activePiece.clientWidth;
      const pieceHeight = activePiece.clientHeight;

      // Calculate boundaries, adjusting max values by piece dimensions
      const minX = chessboard.offsetLeft;
      const minY = chessboard.offsetTop;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - pieceWidth;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - pieceHeight;

      // Calculate new position with boundaries
      const x = Math.min(Math.max(e.clientX - pieceWidth / 2, minX), maxX);
      const y = Math.min(Math.max(e.clientY - pieceHeight / 2, minY), maxY);

      // Apply position to active piece
      activePiece.style.position = "absolute";
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  }

  // Function to drop a piece
  function dropPiece(e: React.MouseEvent) {
    if (activePiece) {
      activePiece = null;
    }
  }

  // Chess board implementation
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
  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessBoardRef}
    >
      {board}
    </div>
  );
}
