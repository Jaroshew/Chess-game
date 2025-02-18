import { Position } from "../../Tile/Constants";

export class KnightRules {
  // Check if a knight move is valid
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position
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

    return knightMoves.some(
      ([dx, dy]) =>
        initialPosition.x + dx === desiredPosition.x &&
        initialPosition.y + dy === desiredPosition.y
    );
  }
}
