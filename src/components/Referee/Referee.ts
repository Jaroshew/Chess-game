import { PieceType, TeamType, Piece, Position } from "../Tile/Constants";

import {
  PawnRules,
  KnightRules,
  BishopRules,
  RookRules,
  QueenRules,
  KingRules,
} from "./Rules";

export default class Referee {
  // Method to check if the move is valid
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    switch (type) {
      case PieceType.PAWN:
        return PawnRules.isValidMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
      case PieceType.KNIGHT:
        return KnightRules.isValidMove(initialPosition, desiredPosition);
      case PieceType.BISHOP:
        return BishopRules.isValidMove(
          initialPosition,
          desiredPosition,
          boardState
        );
      case PieceType.ROOK:
        return RookRules.isValidMove(
          initialPosition,
          desiredPosition,
          boardState
        );
      case PieceType.QUEEN:
        return QueenRules.isValidMove(
          initialPosition,
          desiredPosition,
          boardState
        );
      case PieceType.KING:
        return KingRules.isValidMove(initialPosition, desiredPosition);
      default:
        return false;
    }
  }

  // En passant logic
  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if (Math.abs(desiredPosition.x - initialPosition.x) === 1) {
      // Find the pawn that is eligible for en passant
      const piece = boardState.find(
        (p) =>
          p.position.x === desiredPosition.x &&
          p.position.y === desiredPosition.y - pawnDirection &&
          p.enPassant
      );
      return !!piece;
    }
    return false;
  }
}