import { Position, Piece, TeamType } from "../../Tile/Constants";

export class BishopRules {
  // Check if a bishop move is valid
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
    // Ensure move is diagonal
    if (
      Math.abs(desiredPosition.x - initialPosition.x) !==
      Math.abs(desiredPosition.y - initialPosition.y)
    ) {
      return false;
    }

    const dx = desiredPosition.x > initialPosition.x ? 1 : -1;
    const dy = desiredPosition.y > initialPosition.y ? 1 : -1;

    let x = initialPosition.x + dx;
    let y = initialPosition.y + dy;

    // Traverse the diagonal path, checking for blockages
    while (x !== desiredPosition.x && y !== desiredPosition.y) {
      if (isPositionOccupiedBySameTeam({ x, y }, team, boardState)) {
        return false;
      }
      x += dx;
      y += dy;
    }

    // Ensure the destination is not occupied by the same team
    if (isPositionOccupiedBySameTeam(desiredPosition, team, boardState)) {
      return false;
    }

    return true;
  }
}

// Get possible moves for a bishop
export const getPossibleBishopMoves = (
  bishop: Piece,
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
    { dx: 1, dy: 1 }, // top-right
    { dx: -1, dy: 1 }, // top-left
    { dx: 1, dy: -1 }, // bottom-right
    { dx: -1, dy: -1 }, // bottom-left
  ];

  for (const { dx, dy } of directions) {
    let newX = bishop.position.x + dx;
    let newY = bishop.position.y + dy;

    // Traverse the diagonal path
    while (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      if (isPositionOccupiedBySameTeam({ x: newX, y: newY }, bishop.team, boardState)) {
        break;
      }

      possibleMoves.push({ x: newX, y: newY });

      if (tileIsOccupiedByOpponent(newX, newY, boardState, bishop.team)) {
        break;
      }

      // Move further in the diagonal direction
      newX += dx;
      newY += dy;
    }
  }

  return possibleMoves;
};