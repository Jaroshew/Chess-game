import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

/**
 * Represents a Pawn piece in chess.
 * Includes an enPassant flag for special capture moves.
 */
export class Pawn extends Piece {
  enPassant?: boolean;

  constructor(
    position: Position,
    team: TeamType,
    hasMoved: boolean,
    enPassant?: boolean,
    possibleMoves: Position[] = []
  ) {
    super(position, PieceType.PAWN, team, hasMoved, possibleMoves);
    this.enPassant = enPassant;
  }

  // Creates a deep clone of the Pawn.
  clone(): Pawn {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.hasMoved,
      this.enPassant,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}