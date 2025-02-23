import { Position } from "../../Tile/Constants";

export class KingRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position
  ): boolean {
    if (
      desiredPosition.x < 0 ||
      desiredPosition.x > 7 ||
      desiredPosition.y < 0 ||
      desiredPosition.y > 7
    ) {
      return false;
    }

    return (
      Math.abs(desiredPosition.x - initialPosition.x) <= 1 &&
      Math.abs(desiredPosition.y - initialPosition.y) <= 1
    );
  }
}
