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
    ) => boolean,
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

    if (tileIsOccupiedByOpponent(desiredPosition.x, desiredPosition.y, boardState, team)) {
      return true;
    }

    return true;
  }
}