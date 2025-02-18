import { Position, Piece, TeamType, PieceType } from "../../Tile/Constants";

export class PawnRules {
  // Check if a pawn move is valid
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const specialRow = team === TeamType.WHITE ? 1 : 6; // Row where a pawn can move two squares
    const pawnDirection = team === TeamType.WHITE ? 1 : -1; // Determines movement direction

    // Moving two squares from starting position
    if (
      initialPosition.x === desiredPosition.x &&
      initialPosition.y === specialRow &&
      desiredPosition.y - initialPosition.y === 2 * pawnDirection &&
      !this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) &&
      !this.tileIsOccupied(
        desiredPosition.x,
        desiredPosition.y - pawnDirection,
        boardState
      )
    ) {
      return true;
    }

    // Moving one square forward
    if (
      initialPosition.x === desiredPosition.x &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      !this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)
    ) {
      return true;
    }

    // Capturing diagonally
    if (
      Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      this.tileIsOccupiedByOpponent(
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

  // Utility methods to check if a tile is occupied
  static tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some((p) => p.position.x === x && p.position.y === y);
  }

  static tileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return boardState.some(
      (p) => p.position.x === x && p.position.y === y && p.team !== team
    );
  }
}