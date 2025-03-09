import { samePosition, TeamType } from "../Constants";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

// Queen movement rules, combining Rook and Bishop logic
export const QueenRules = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Calculate direction for diagonal or straight movement
  let multiplierX = 0;
  let multiplierY = 0;

  if (desiredPosition.x < initialPosition.x) multiplierX = -1;
  else if (desiredPosition.x > initialPosition.x) multiplierX = 1;

  if (desiredPosition.y < initialPosition.y) multiplierY = -1;
  else if (desiredPosition.y > initialPosition.y) multiplierY = 1;

  for (let i = 1; i < 8; i++) {
    const passedPosition = new Position(
      initialPosition.x + i * multiplierX,
      initialPosition.y + i * multiplierY
    );

    // If destination reached, check if move is valid
    if (samePosition(passedPosition, desiredPosition)) {
      if (tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
        return true;
      }
    } else if (tileIsOccupied(passedPosition, boardState)) {
      break; // Stop if path is blocked
    }

    // Stop if diagonal direction and reached the edge of board
    if (multiplierX !== 0 && multiplierY !== 0 && i > 7) break;
  }
  return false; // Invalid move if no valid path found
};

// Get all possible Queen moves (combining Rook and Bishop moves)
export const getPossibleQueenMoves = (
  queen: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
    { dx: 1, dy: 1 }, // Upper right
    { dx: 1, dy: -1 }, // Bottom right
    { dx: -1, dy: -1 }, // Bottom left
    { dx: -1, dy: 1 }, // Top left
  ];

  // Check all possible directions
  for (const { dx, dy } of directions) {
    for (let i = 1; i < 8; i++) {
      const destination = new Position(
        queen.position.x + i * dx,
        queen.position.y + i * dy
      );

      if (!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination); // Empty space
      } else if (
        tileIsOccupiedByOpponent(destination, boardState, queen.team)
      ) {
        possibleMoves.push(destination); // Can capture opponent piece
        break; // Stop if piece is captured
      } else {
        break; // Stop if path is blocked
      }
    }
  }

  return possibleMoves;
};
