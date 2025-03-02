import { Position, Piece, TeamType } from "../../Tile/Constants";

export class RookRules {
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
    // Rook moves in straight lines (horizontal or vertical)
    if (
      initialPosition.x !== desiredPosition.x &&
      initialPosition.y !== desiredPosition.y
    ) {
      return false;
    }

    const dx =
      initialPosition.x === desiredPosition.x
        ? 0
        : desiredPosition.x > initialPosition.x
        ? 1
        : -1;
    const dy =
      initialPosition.y === desiredPosition.y
        ? 0
        : desiredPosition.y > initialPosition.y
        ? 1
        : -1;

    let x = initialPosition.x + dx;
    let y = initialPosition.y + dy;

    while (x !== desiredPosition.x || y !== desiredPosition.y) {
      if (isPositionOccupiedBySameTeam({ x, y }, team, boardState)) {
        return false; // A piece of the same team blocks the move
      }

      if (tileIsOccupiedByOpponent(x, y, boardState, team)) {
        // If an opponent's piece is encountered, capture it and stop
        return true;
      }

      x += dx;
      y += dy;
    }

    return true;
  }
}

// Get possible moves for a rook
export const getPossibleRookMoves = (
  rook: Piece,
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
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
  ];

  // Check all possible rook moves
  for (const { dx, dy } of directions) {
    let newX = rook.position.x + dx;
    let newY = rook.position.y + dy;

    // Move (dx, dy) until the end of the board or until a piece is encountered
    while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      const newPosition: Position = { x: newX, y: newY };

      if (isPositionOccupiedBySameTeam(newPosition, rook.team, boardState)) {
        break;
      }

      if (tileIsOccupiedByOpponent(newX, newY, boardState, rook.team)) {
        possibleMoves.push(newPosition);
        break;
      }

      // If the square is empty, add it to possible moves and continue
      possibleMoves.push(newPosition);

      newX += dx;
      newY += dy;
    }
  }

  return possibleMoves;
};