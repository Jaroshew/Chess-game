import { Position, Piece } from "../../Tile/Constants";

export class RookRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    boardState: Piece[]
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

    while (x !== desiredPosition.x || y !== desiredPosition.y) {
      if (this.tileIsOccupied(x, y, boardState)) return false;
      x += dx;
      y += dy;
    }

    return true;
  }

  static tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some((p) => p.position.x === x && p.position.y === y);
  }
}
