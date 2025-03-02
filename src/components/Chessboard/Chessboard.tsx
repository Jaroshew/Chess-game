import React, { useState, useRef, useCallback } from "react";
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
  const [promotionPosition, setPromotionPosition] = useState<Position | null>(
    null
  ); // Position where promotion happens
  const modalRef = useRef<HTMLDivElement>(null); // Reference to the promotion DOM element
  const chessBoardRef = useRef<HTMLDivElement>(null); // Reference to the chessboard DOM element
  const referee = new Referee(); // Handles chess rules and move validation
  const animationFrameRef = useRef<number>();

  // Update valid moves for all pieces
  const updateValidMoves = useCallback(() => {
    setPieces((currentPieces) =>
      currentPieces.map((p) => {
        p.possibleMoves = referee.getValidMoves(p, currentPieces);
        return p;
      })
    );
  }, [referee]);

  // When a piece is grabbed
  const grabPiece = (e: React.MouseEvent) => {
    updateValidMoves();
    const element = e.target as HTMLElement;
    const chessboard = chessBoardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const boardRect = chessboard.getBoundingClientRect();
      const grabX = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
      // Invert Y axis
      const boardY = Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
      const grabY = 7 - boardY;
      setGrabPosition({ x: grabX, y: grabY });

      // Center the piece on the cursor
      const pieceX = e.clientX - GRID_SIZE / 2;
      const pieceY = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${pieceX}px`;
      element.style.top = `${pieceY}px`;

      setActivePiece(element);
    }
  };

  // Move piece handler (with requestAnimationFrame)
  const movePiece = useCallback(
    (e: React.MouseEvent) => {
      const chessboard = chessBoardRef.current;
      if (activePiece && chessboard) {
        const pieceWidth = activePiece.clientWidth;
        const pieceHeight = activePiece.clientHeight;
        const boardRect = chessboard.getBoundingClientRect();
        const minX = boardRect.left;
        const minY = boardRect.top;
        const maxX = boardRect.left + chessboard.clientWidth - pieceWidth;
        const maxY = boardRect.top + chessboard.clientHeight - pieceHeight;
        const x = Math.min(Math.max(e.clientX - pieceWidth / 2, minX), maxX);
        const y = Math.min(Math.max(e.clientY - pieceHeight / 2, minY), maxY);
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
      }
    },
    [activePiece]
  );

  // Throttle mouse move updates with requestAnimationFrame
  const onMouseMove = (e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => movePiece(e));
  };

  // Triggered when a piece is dropped
  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessBoardRef.current;
    if (activePiece && chessboard) {
      const boardRect = chessboard.getBoundingClientRect();
      const dropX = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
      const boardY = Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
      const dropY = 7 - boardY; // инвертируем координату Y

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );

      if (currentPiece) {
        const validMove = referee.isValidMove(
          grabPosition,
          { x: dropX, y: dropY },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x: dropX, y: dropY },
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.WHITE ? 1 : -1;

        if (isEnPassantMove) {
          // Handle en passant move
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position = { x: dropX, y: dropY };
              results.push(piece);
            } else if (
              !samePosition(piece.position, {
                x: dropX,
                y: dropY - pawnDirection,
              })
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
                Math.abs(grabPosition.y - dropY) === 2 &&
                piece.type === PieceType.PAWN;
              piece.position = { x: dropX, y: dropY };
              results.push(piece);
            } else if (!samePosition(piece.position, { x: dropX, y: dropY })) {
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

        // Check for pawn promotion
        if (
          currentPiece.type === PieceType.PAWN &&
          (dropY === 0 || dropY === 7)
        ) {
          setPromotionPosition({ x: dropX, y: dropY });
          setPromotionVisible(true);
        }
      }

      setActivePiece(null);
    }
  };

  // Handle promotion choice
  const handlePromotion = (pieceType: PieceType) => {
    if (promotionPosition) {
      const updatedPieces = pieces.map((piece) => {
        // Check if the piece is a pawn at the promotion position
        if (
          samePosition(piece.position, promotionPosition) &&
          piece.type === PieceType.PAWN
        ) {
          // Get the image based on the selected piece type and the team
          const teamSuffix = piece.team === TeamType.WHITE ? "w" : "b";
          const image = `assets/images/${PieceType[
            pieceType
          ].toLowerCase()}_${teamSuffix}.svg`;
          return { ...piece, type: pieceType, image };
        }
        return piece;
      });
      modalRef.current?.classList.add("hidden");
      setPieces(updatedPieces); // Update the board with the new piece
      setPromotionVisible(false); // Hide the promotion menu
    }
  };

  // Build the board
  const board = [];
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j })
      );
      const image = piece ? piece.image : undefined;

      // Highlight valid moves for the currently active piece
      const currentPiece = activePiece
        ? pieces.find((p) => samePosition(p.position, grabPosition))
        : undefined;
      const highlight =
        currentPiece?.possibleMoves?.some((p) =>
          samePosition(p, { x: i, y: j })
        ) || false;

      board.push(
        <Tile
          key={`${j},${i}`}
          image={image}
          coordinate={number}
          highlight={highlight}
        />
      );
    }
  }

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseDown={grabPiece}
      onMouseUp={dropPiece}
      id="chessboard"
      ref={chessBoardRef}
    >
      {board}
      {isPromotionVisible && (
        <div id="pawn-promotion" className="show" ref={modalRef}>
          <div className="promotion-window">
            <button onClick={() => handlePromotion(PieceType.QUEEN)}>
              Queen
            </button>
            <button onClick={() => handlePromotion(PieceType.ROOK)}>
              Rook
            </button>
            <button onClick={() => handlePromotion(PieceType.BISHOP)}>
              Bishop
            </button>
            <button onClick={() => handlePromotion(PieceType.KNIGHT)}>
              Knight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}