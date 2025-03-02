import { PieceType, TeamType, Piece, Position } from "../Tile/Constants";

import {
  PawnRules,
  KnightRules,
  BishopRules,
  RookRules,
  QueenRules,
  KingRules,
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves
} from "./Rules";

export default class Referee {
  // Check if the position is occupied by a piece of the same team
  tileIsOccupiedBySameTeam(
    position: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    return boardState.some(
      (p) =>
        p.position.x === position.x &&
        p.position.y === position.y &&
        p.team === team
    );
  }

  // Check if the position is occupied by a piece of the opposite team
  tileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return boardState.some(
      (p) => p.position.x === x && p.position.y === y && p.team !== team
    );
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
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.KNIGHT:
        return KnightRules.isValidMove(
          initialPosition,
          desiredPosition,
          team,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.BISHOP:
        return BishopRules.isValidMove(
          initialPosition,
          desiredPosition,
          team,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.ROOK:
        return RookRules.isValidMove(
          initialPosition,
          desiredPosition,
          team,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.QUEEN:
        return QueenRules.isValidMove(
          initialPosition,
          desiredPosition,
          team,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.KING:
        return KingRules.isValidMove(initialPosition, desiredPosition);
      default:
        return false;
    }
  }

    // Method to get the valid moves for a piece
    getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
    switch(piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.BISHOP:
        return getPossibleBishopMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.ROOK:
        return getPossibleRookMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.QUEEN:
        return getPossibleQueenMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      case PieceType.KING:
        return getPossibleKingMoves(
          piece,
          boardState,
          this.tileIsOccupiedBySameTeam.bind(this),
          this.tileIsOccupiedByOpponent.bind(this)
        );
      default:
        return [];
    }
  }
} 