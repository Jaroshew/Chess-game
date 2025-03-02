import { Position, Piece, TeamType } from "../../Tile/Constants";
import { BishopRules } from "./BishopRules";
import { RookRules } from "./RookRules";

export class QueenRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[],
    isPositionOccupiedBySameTeam: (
      position: Position,
      team: TeamType,
      boardState: Piece[]
    ) => boolean,
    tileIsOccupiedByOpponent: (
      x: number,
      y: number,
      boardState: Piece[],
      team: TeamType
    ) => boolean
  ): boolean {
    return (
      BishopRules.isValidMove(
        initialPosition,
        desiredPosition,
        team,
        boardState,
        isPositionOccupiedBySameTeam,
        tileIsOccupiedByOpponent
      ) ||
      RookRules.isValidMove(
        initialPosition,
        desiredPosition,
        team,
        boardState,
        isPositionOccupiedBySameTeam,
        tileIsOccupiedByOpponent
      )
    );
  }
}

// Get all possible queen moves
export const getPossibleQueenMoves = (
  queen: Piece,
  boardState: Piece[],
  isPositionOccupiedBySameTeam: (
    position: Position,
    team: TeamType,
    boardState: Piece[]
  ) => boolean,
  tileIsOccupiedByOpponent: (
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ) => boolean
): Position[] => {
  const possibleMoves: Position[] = [];

  // Directions for the bishop-like moves (diagonals)
  const diagonalDirections = [
    { dx: 1, dy: 1 }, // Up-right
    { dx: -1, dy: 1 }, // Up-left
    { dx: 1, dy: -1 }, // Down-right
    { dx: -1, dy: -1 }, // Down-left
  ];

  // Directions for the rook-like moves (horizontal and vertical)
  const straightDirections = [
    { dx: 1, dy: 0 }, // Right (horizontal)
    { dx: -1, dy: 0 }, // Left (horizontal)
    { dx: 0, dy: 1 }, // Up (vertical)
    { dx: 0, dy: -1 }, // Down (vertical)
  ];

  // Function to handle moves in a given direction
  const addMoves = (dx: number, dy: number) => {
    let newX = queen.position.x;
    let newY = queen.position.y;

    // Traverse in the direction (dx, dy) until we go off the board or hit a piece
    while (true) {
      newX += dx;
      newY += dy;

      if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) {
        break;
      }

      const newPosition: Position = { x: newX, y: newY };

      if (isPositionOccupiedBySameTeam(newPosition, queen.team, boardState)) {
        break;
      }

      possibleMoves.push(newPosition);

      if (tileIsOccupiedByOpponent(newX, newY, boardState, queen.team)) {
        break;
      }
    }
  };

  // Add bishop-like moves (diagonals)
  for (const { dx, dy } of diagonalDirections) {
    addMoves(dx, dy);
  }

  // Add rook-like moves (horizontal and vertical)
  for (const { dx, dy } of straightDirections) {
    addMoves(dx, dy);
  }

  return possibleMoves;
};