import React, { useState, useRef, useEffect } from "react";
import Tile from "../Tile/Tile";
import "./Chessboard.css";
import Referee from "../Referee/Referee";

// Define the chessboard axis
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Chess piece type definition
export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export enum TeamType {
  BLACK,
  WHITE,
}

export enum PieceType {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
}

// Initialize the chessboard with all the pieces in their starting positions
const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.BLACK : TeamType.WHITE;
  const type = teamType === TeamType.BLACK ? "b" : "w";
  const y = teamType === TeamType.BLACK ? 7 : 0;

  initialBoardState.push({
    image: `assets/images/rook_${type}.svg`,
    x: 0,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/rook_${type}.svg`,
    x: 7,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.svg`,
    x: 1,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.svg`,
    x: 6,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.svg`,
    x: 2,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.svg`,
    x: 5,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/queen_${type}.svg`,
    x: 3,
    y,
    type: PieceType.QUEEN,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/king_${type}.svg`,
    x: 4,
    y,
    type: PieceType.KING,
    team: teamType,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: `assets/images/pawn_b.svg`,
    x: i,
    y: 6,
    type: PieceType.PAWN,
    team: TeamType.BLACK,
  });
  initialBoardState.push({
    image: `assets/images/pawn_w.svg`,
    x: i,
    y: 1,
    type: PieceType.PAWN,
    team: TeamType.WHITE,
  });
}

// Chess board function
export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  // Function to grab a piece
  function grabPiece(e: React.MouseEvent) {
    const chessboard = chessBoardRef.current;
    const element = e.target as HTMLElement;

    if (element.classList.contains("chess-piece") && chessboard) {
      // Calculate grid position
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      );

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
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
    const chessboard = chessBoardRef.current;

    if (activePiece && chessboard) {
      // Calculate new position
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
      );

      // Attacked piece finder
      const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
      const attackedPiece = pieces.find((p) => p.x === x && p.y === y);

      // Check if there is a piece at the current grid location
      if (currentPiece) {
        const validMove = referee.isValidMove(
          gridX,
          gridY,
          x,
          y,
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        if (validMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === currentPiece.x && piece.y === currentPiece.y) {
              piece.x = x;
              piece.y = y;
              results.push(piece);
            } else if (!(piece.x === x && piece.y === y)) {
              results.push(piece);
            }

            return results; // Return the results array for the next iteration
          }, [] as Piece[]);

          setPieces(updatedPieces);
          
        } else {
          // Reset piece position
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("left");
          activePiece.style.removeProperty("top");
        }
      }
      setActivePiece(null);
    }
  }

  let board = [];
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