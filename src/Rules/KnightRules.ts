import { TeamType } from "../Constants";
import { Piece, Position } from "../Models";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

// Helper function to check if the knight's move is valid
const isValidKnightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const dx = Math.abs(desiredPosition.x - initialPosition.x);
  const dy = Math.abs(desiredPosition.y - initialPosition.y);

  // Knight moves in "L" shape: 2 squares in one direction and 1 square in the other
  if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
    return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
  }

  return false;
};

export const KnightRules = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  return isValidKnightMove(initialPosition, desiredPosition, team, boardState);
};

export const getPossibleKnightMoves = (
  knight: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1], // 2 squares in x direction, 1 in y direction
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2], // 1 square in x direction, 2 in y direction
  ];

  directions.forEach(([dx, dy]) => {
    const newPosition = new Position(
      knight.position.x + dx,
      knight.position.y + dy
    );
    if (tileIsEmptyOrOccupiedByOpponent(newPosition, boardState, knight.team)) {
      possibleMoves.push(newPosition);
    }
  });

  return possibleMoves;
};
