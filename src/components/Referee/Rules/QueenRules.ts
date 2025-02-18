import { Position, Piece } from "../../Tile/Constants";
import { BishopRules } from "./BishopRules";
import { RookRules } from "./RookRules";

export class QueenRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    boardState: Piece[]
  ): boolean {
    return (
      BishopRules.isValidMove(initialPosition, desiredPosition, boardState) ||
      RookRules.isValidMove(initialPosition, desiredPosition, boardState)
    );
  }
}