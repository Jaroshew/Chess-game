import { Position } from "../../Tile/Constants";

export class KingRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position
  ): boolean {
    return (
      Math.abs(desiredPosition.x - initialPosition.x) <= 1 &&
      Math.abs(desiredPosition.y - initialPosition.y) <= 1
    );
  }
}