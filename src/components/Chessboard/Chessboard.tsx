import { useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from "../../Constants";
import { Piece, Position } from "../../Models";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

export default function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  );
  const chessboardRef = useRef<HTMLDivElement>(null);

  // Handle mouse down: grab a chess piece for dragging
  function grabPiece(e: React.MouseEvent) {
    e.preventDefault();
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (chessboard && element.classList.contains("chess-piece")) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      // Center the piece under the cursor
      element.style.position = "absolute";
      element.style.left = `${e.clientX - GRID_SIZE / 2}px`;
      element.style.top = `${e.clientY - GRID_SIZE / 2}px`;
      setActivePiece(element);
    }
  }

  // Update piece position during dragging with boundary constraints
  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";
      activePiece.style.left = `${Math.min(maxX, Math.max(x, minX))}px`;
      activePiece.style.top = `${Math.min(maxY, Math.max(y, minY))}px`;
    }
  }

  // Drop the piece and attempt to perform the move
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      const currentPiece = pieces.find((p) => p.samePosition(grabPosition));
      if (currentPiece) {
        const success = playMove(currentPiece.clone(), new Position(x, y));
        if (!success) {
          // Reset position if move is invalid
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  // Build the chessboard grid with tiles
  const board = [];
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const tilePosition = new Position(i, j);
      const number = j + i + 2;
      const piece = pieces.find((p) => p.samePosition(tilePosition));
      const image = piece ? piece.image : undefined;
      const currentPiece = activePiece
        ? pieces.find((p) => p.samePosition(grabPosition))
        : undefined;
      const highlight =
        currentPiece?.possibleMoves?.some((p) =>
          p.samePosition(tilePosition)
        ) || false;

      board.push(
        <Tile
          key={`${j},${i}`}
          image={image}
          number={number}
          highlight={highlight}
        />
      );
    }
  }

  return (
    <div
      id="chessboard"
      ref={chessboardRef}
      onMouseDown={grabPiece}
      onMouseMove={movePiece}
      onMouseUp={dropPiece}
    >
      {board}
    </div>
  );
}