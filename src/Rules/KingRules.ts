import { samePosition, TeamType } from "../Constants";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

// King movement rule
export const KingRules = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Check if the desired position is one square away in any direction
  const dx = Math.abs(desiredPosition.x - initialPosition.x);
  const dy = Math.abs(desiredPosition.y - initialPosition.y);

  if (dx <= 1 && dy <= 1) {
    // If it's a valid move (within one square), check if it's empty or occupied by an opponent
    return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
  }

  return false;
};

// Get all possible King moves
export const getPossibleKingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Directions: 8 possible moves (horizontally, vertically, and diagonally)
  const directions = [
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
    { dx: 1, dy: 1 }, // Upper-right
    { dx: 1, dy: -1 }, // Bottom-right
    { dx: -1, dy: 1 }, // Upper-left
    { dx: -1, dy: -1 }, // Bottom-left
  ];

  // Check all possible directions
  for (const { dx, dy } of directions) {
    const destination = new Position(
      king.position.x + dx,
      king.position.y + dy
    );

    if (!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination); // Empty square
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination); // Can capture opponent's piece
    }
  }

  return possibleMoves;
};
