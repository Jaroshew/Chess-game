export class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Checks if this position is equal to another position.
  samePosition(otherPosition: Position): boolean {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }

  // Clone the position
  clone(): Position {
    return new Position(this.x, this.y);
  }
}