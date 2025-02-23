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

    while (x !== desiredPosition.x && y !== desiredPosition.y) {
      if (isPositionOccupiedBySameTeam({ x, y }, team, boardState)) {
        return false;
      }
      x += dx;
      y += dy;
    }

    if (isPositionOccupiedBySameTeam(desiredPosition, team, boardState)) {
      return false;
    }

    if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
      return true;
    }

    return true;
  }
}