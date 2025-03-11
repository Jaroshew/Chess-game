import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

// A simplified version of a chess piece, storing only essential information.
export class SimplifiedPiece {
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];

  // Creates a simplified piece from a regular piece.
  constructor(piece: Piece) {
    this.position = piece.position.clone();
    this.type = piece.type;
    this.team = piece.team;
    // Clone the possible moves if available
    this.possibleMoves = piece.possibleMoves?.map((pm) => pm.clone());
  }
}
