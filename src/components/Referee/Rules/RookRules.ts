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
    let hasCaptured = false;

    while (x !== desiredPosition.x || y !== desiredPosition.y) {
      if (isPositionOccupiedBySameTeam({ x, y }, team, boardState)) {
        return false;
      }

      if (tileIsOccupiedByOpponent(x, y, boardState, team)) {
        if (hasCaptured) {
          return false;
        }
        hasCaptured = true;
      }

      x += dx;
      y += dy;
    }

    if (isPositionOccupiedBySameTeam(desiredPosition, team, boardState)) {
      return false;
    }

    if (
      tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      if (hasCaptured) {
        return false;
      }
    }

    return true;
  }
}