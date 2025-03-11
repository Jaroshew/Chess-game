import { TeamType, PieceType } from "../Types";
import { Position } from "./Position";

// Represents a chess piece with its image, position, type, team, possible moves, and movement status.
export class Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  possibleMoves?: Position[];
  hasMoved: boolean;

  constructor(
    position: Position,
    type: PieceType,
    team: TeamType,
    hasMoved: boolean,
    possibleMoves: Position[] = []
  ) {
    this.image = `assets/images/${type}_${team}.svg`;
    this.position = position;
    this.type = type;
    this.team = team;
    this.possibleMoves = possibleMoves;
    this.hasMoved = hasMoved;
  }

  // Getters to quickly check the piece type
  get isPawn() {
    return this.type === PieceType.PAWN;
  }
  get isRook() {
    return this.type === PieceType.ROOK;
  }
  get isKnight() {
    return this.type === PieceType.KNIGHT;
  }
  get isBishop() {
    return this.type === PieceType.BISHOP;
  }
  get isKing() {
    return this.type === PieceType.KING;
  }
  get isQueen() {
    return this.type === PieceType.QUEEN;
  }

  
  // Checks if this piece occupies the same position as another piece.
  samePiecePosition(other: Piece): boolean {
    return this.position.samePosition(other.position);
  }

  // Checks if this piece's position is the same as the given position.
  samePosition(pos: Position): boolean {
    return this.position.samePosition(pos);
  }

  // Creates a deep clone of the piece.
  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.hasMoved,
      this.possibleMoves?.map((m) => m.clone())
    );
  }
}