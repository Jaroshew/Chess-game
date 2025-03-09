import { samePosition, TeamType } from "../Constants";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

// Rook movement rule
export const RookRules = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (
    initialPosition.x === desiredPosition.x ||
    initialPosition.y === desiredPosition.y
  ) {
    const dx = Math.abs(desiredPosition.x - initialPosition.x);
    const dy = Math.abs(desiredPosition.y - initialPosition.y);

    if (dx === 0 || dy === 0) {
      // If moving along the row or column, check the path
      const stepX =
        dx === 0 ? 0 : desiredPosition.x > initialPosition.x ? 1 : -1;
      const stepY =
        dy === 0 ? 0 : desiredPosition.y > initialPosition.y ? 1 : -1;

      let x = initialPosition.x;
      let y = initialPosition.y;

      while (x !== desiredPosition.x || y !== desiredPosition.y) {
        x += stepX;
        y += stepY;

        const passedPosition = new Position(x, y);

        if (samePosition(passedPosition, desiredPosition)) {
          return tileIsEmptyOrOccupiedByOpponent(
            passedPosition,
            boardState,
            team
          );
        } else if (tileIsOccupied(passedPosition, boardState)) {
          break; // Blocked by piece
        }
      }
      return true;
    }
  }
  return false;
};

// Get all possible Rook moves
export const getPossibleRookMoves = (
  rook: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Directions: 4 possible moves (up, down, left, right)
  const directions = [
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }, // Right
  ];

  // Check all possible directions
  for (const { dx, dy } of directions) {
    let x = rook.position.x;
    let y = rook.position.y;

    for (let i = 1; i < 8; i++) {
      x += dx;
      y += dy;

      const destination = new Position(x, y);

      if (!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination); // Empty square
      } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
        possibleMoves.push(destination); // Can capture opponent's piece
        break;
      } else {
        break; // Blocked by own piece
      }
    }
  }

  return possibleMoves;
};
