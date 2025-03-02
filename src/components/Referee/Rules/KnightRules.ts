import { Position, Piece, TeamType } from "../../Tile/Constants";

export class KnightRules {
  // Check if a knight move is valid
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
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    const validMove = knightMoves.some(
      ([dx, dy]) =>
        initialPosition.x + dx === desiredPosition.x &&
        initialPosition.y + dy === desiredPosition.y
    );

    if (!validMove) {
      return false;
    }

    if (isPositionOccupiedBySameTeam(desiredPosition, team, boardState)) {
      return false;
    }

    return true;
  }
}

// Get possible moves for a knight
export const getPossibleKnightMoves = (
  knight: Piece,
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
  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  // Check all possible knight moves
  for (const [dx, dy] of knightMoves) {
    const newX = knight.position.x + dx;
    const newY = knight.position.y + dy;

    // Check if the move is within the bounds of the board
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      const newPosition: Position = { x: newX, y: newY };

      // If the move is valid and not occupied by the same team or opponent's piece
      if (
        !isPositionOccupiedBySameTeam(newPosition, knight.team, boardState) &&
        !tileIsOccupiedByOpponent(
          newPosition.x,
          newPosition.y,
          boardState,
          knight.team
        )
      ) {
        possibleMoves.push(newPosition);
      }
    }
  }

  return possibleMoves;
};
