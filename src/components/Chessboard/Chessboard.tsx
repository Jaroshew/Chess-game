import { useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  samePosition,
} from "../../Constants";
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

  // Helper function to calculate position constraints
  const getPositionConstraints = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (!chessboard) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const minX = chessboard.offsetLeft - 25;
    const minY = chessboard.offsetTop - 25;
    const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
    const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;

    return { minX, maxX, minY, maxY };
  };

  // Function to grab the piece
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  };

  // Function to move the piece
  const movePiece = (e: React.MouseEvent) => {
    if (activePiece) {
      const { minX, maxX, minY, maxY } = getPositionConstraints(e);

      let x = e.clientX - 50;
      let y = e.clientY - 50;

      // Constrain the piece's position within bounds
      x = Math.min(Math.max(x, minX), maxX);
      y = Math.min(Math.max(y, minY), maxY);

      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  };

  // Function to drop the piece
  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const boardRect = chessboard.getBoundingClientRect();
      const x = Math.floor((e.clientX - boardRect.left) / GRID_SIZE);
      const boardY = Math.floor((e.clientY - boardRect.top) / GRID_SIZE);
      const y = 7 - boardY; // Inverting the y axis

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );
      if (currentPiece && playMove(currentPiece, new Position(x, y))) {
        setActivePiece(null); // Reset active piece after successful move
      } else {
        resetActivePiecePosition(); // Reset if the move was invalid
      }
    }
  };

  // Reset the position of the active piece if the move fails
  const resetActivePiecePosition = () => {
    if (activePiece) {
      activePiece.style.position = "relative";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");
    }
    setActivePiece(null);
  };

  // Create the board tiles with piece highlighting
  const createBoard = () => {
    let board: JSX.Element[] = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find((p) =>
          samePosition(p.position, new Position(i, j))
        );
        const image = piece?.image;
        const currentPiece = activePiece
          ? pieces.find((p) => samePosition(p.position, grabPosition))
          : undefined;

        // Highlight valid moves
        const highlight = currentPiece?.possibleMoves
          ? currentPiece.possibleMoves.some((p) =>
              samePosition(p, new Position(i, j))
            )
          : false;

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

    return board;
  };

  return (
    <div
      id="chessboard"
      ref={chessboardRef}
      onMouseMove={movePiece}
      onMouseDown={grabPiece}
      onMouseUp={dropPiece}
    >
      {createBoard()}
    </div>
  );
}
