import React, { useState, useRef } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import Referee from "../Referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  Piece,
  PieceType,
  TeamType,
  initialBoardState,
  Position,
  samePosition,
} from "../Tile/Constants";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null); // Track the currently grabbed piece
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 }); // Position where the piece was grabbed
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState); // State for all chess pieces
  const [isPromotionVisible, setPromotionVisible] = useState(false); // State to control promotion menu visibility
  const [promotionPosition, setPromotionPosition] = useState<Position | null>(null); // Position where promotion happens
  const modalRef = useRef<HTMLDivElement>(null); // Reference to the promotion DOM element
  const chessBoardRef = useRef<HTMLDivElement>(null); // Reference to the chessboard DOM element
  const referee = new Referee(); // Handles chess rules and move validation

  // Triggered when a piece is grabbed
  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessBoardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition({ x: grabX, y: grabY });

      // Set the piece for dragging
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  // Triggered when a piece is moved (dragging)
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessBoardRef.current;
    if (activePiece && chessboard) {
      const pieceWidth = activePiece.clientWidth;
      const pieceHeight = activePiece.clientHeight;

      // Ensure the piece stays within the chessboard boundaries
      const minX = chessboard.offsetLeft;
      const minY = chessboard.offsetTop;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - pieceWidth;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - pieceHeight;

      const x = Math.min(Math.max(e.clientX - pieceWidth / 2, minX), maxX);
      const y = Math.min(Math.max(e.clientY - pieceHeight / 2, minY), maxY);

      activePiece.style.position = "absolute";
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  }

  // Triggered when a piece is dropped
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessBoardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );

      if (currentPiece) {
        // Validate move and handle special cases
        const validMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;

        if (isEnPassantMove) {
          // Handle en passant move
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else if (validMove) {
          // Update pieces after a valid move
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else {
          // Reset piece position if move is invalid
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }

        // Check for pawn promotion (if it reaches the last rank)
        if (currentPiece.type === PieceType.PAWN && (y === 0 || y === 7)) {
          setPromotionPosition({ x, y });
          setPromotionVisible(true);
        }
      }

      setActivePiece(null); // Clear active piece after dropping
    }
  }

// Handle promotion choice
function handlePromotion(pieceType: PieceType) {
  if (promotionPosition) {
    const updatedPieces = pieces.map((piece) => {
      // Check if the piece is a pawn at the promotion position
      if (samePosition(piece.position, promotionPosition) && piece.type === PieceType.PAWN) {
        // Get the image based on the selected piece type and the team
        const teamSuffix = piece.team === TeamType.WHITE ? "w" : "b";
        const image = `assets/images/${PieceType[pieceType].toLowerCase()}_${teamSuffix}.svg`; // PieceType enum to get image

        return { ...piece, type: pieceType, image }; // Update the piece type and image
      }
      return piece;
    });

    modalRef.current?.classList.add("hidden");

    setPieces(updatedPieces); // Update the board with the new piece
    setPromotionVisible(false); // Hide the promotion menu
  }
}

  let board = [];

  // Generate chessboard tiles and pieces
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      let image = piece ? piece.image : undefined;

      board.push(<Tile key={`${j},${i}`} image={image} coordinate={number} />);
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

      {/* Promotion Menu (appears when a pawn reaches the last rank) */}
      {isPromotionVisible && (
        <div
          id="pawn-promotion"
          className={isPromotionVisible ? "show" : "hidden"} ref={modalRef}>
          <div className="promotion-window">
            <button onClick={() => handlePromotion(PieceType.QUEEN)}>Queen</button>
            <button onClick={() => handlePromotion(PieceType.ROOK)}>Rook</button>
            <button onClick={() => handlePromotion(PieceType.BISHOP)}>Bishop</button>
            <button onClick={() => handlePromotion(PieceType.KNIGHT)}>Knight</button>
          </div>
        </div>
      )}
    </div>
  );
}