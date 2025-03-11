import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

/**
 * Represents a chess move including the team, piece type,
 * starting position, and destination.
 */
export class Move {
  team: TeamType;
  piece: PieceType;
  fromPosition: Position;
  toPosition: Position;

  constructor(
    team: TeamType,
    piece: PieceType,
    fromPosition: Position,
    toPosition: Position
  ) {
    this.team = team;
    this.piece = piece;
    this.fromPosition = fromPosition;
    this.toPosition = toPosition;
  }

  // Returns a descriptive message for the move.
  toMessage(): string {
    const teamName = this.team === TeamType.OPPONENT ? "Black" : "White";
    return `${teamName} moved ${this.piece} from ${this.fromPosition.x}, ${this.fromPosition.y} to ${this.toPosition.x}, ${this.toPosition.y}.`;
  }

  // Creates a deep clone of the move.
  clone(): Move {
    return new Move(
      this.team,
      this.piece,
      this.fromPosition.clone(),
      this.toPosition.clone()
    );
  }
}