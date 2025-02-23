import { Position, Piece, TeamType } from "../../Tile/Constants";

export class PawnRules {
  // Check if a pawn move is valid
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
    const specialRow = team === TeamType.WHITE ? 1 : 6; // Row where a pawn can move two squares
    const pawnDirection = team === TeamType.WHITE ? 1 : -1; // Determines movement direction

    // Moving two squares from starting position
    if (
      initialPosition.x === desiredPosition.x &&
      initialPosition.y === specialRow &&
      desiredPosition.y - initialPosition.y === 2 * pawnDirection &&
      !isPositionOccupiedBySameTeam(desiredPosition, team, boardState) &&
      !tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    // Moving one square forward
    if (
      initialPosition.x === desiredPosition.x &&
      !isPositionOccupiedBySameTeam(desiredPosition, team, boardState) &&
      !tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    // Capturing diagonally
    if (
      Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    return false;
  }
}