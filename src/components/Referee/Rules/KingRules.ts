import { Position, Piece, TeamType } from "../../Tile/Constants";

export class KingRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position
  ): boolean {
    if (
      desiredPosition.x < 0 ||
      desiredPosition.x > 7 ||
      desiredPosition.y < 0 ||
      desiredPosition.y > 7
    ) {
      return false;
    }

    return (
      Math.abs(desiredPosition.x - initialPosition.x) <= 1 &&
      Math.abs(desiredPosition.y - initialPosition.y) <= 1
    );
  }
}

// Get all possible moves for a king
export const getPossibleKingMoves = (
  king: Piece,
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
  const directions = [
    [-1, -1], // top-left
    [0, -1], // top
    [1, -1], // top-right
    [-1, 0], // left
    [1, 0], // right
    [-1, 1], // bottom-left
    [0, 1], // bottom
    [1, 1], // bottom-right
  ];

  // All 8 possible directions
  for (const [dx, dy] of directions) {
    const newX = king.position.x + dx;
    const newY = king.position.y + dy;

    // Check if the move is inside the board
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      const newPosition = { x: newX, y: newY };

      // If the cell is not occupied by the same team, it's a valid move
      if (!isPositionOccupiedBySameTeam(newPosition, king.team, boardState)) {
        // If it's occupied by an opponent, it's also a valid move
        if (tileIsOccupiedByOpponent(newX, newY, boardState, king.team)) {
          possibleMoves.push(newPosition);
        }

        // If it's empty, it's a valid move as well
        if (!tileIsOccupiedByOpponent(newX, newY, boardState, king.team)) {
          possibleMoves.push(newPosition);
        }
      }
    }
  }

  return possibleMoves;
};