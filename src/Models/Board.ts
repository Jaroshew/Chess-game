import {
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
  getCastlingMoves,
} from "../Rules";
import { PieceType, TeamType } from "../Types";
import { Move } from "./Move";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";
import { SimplifiedPiece } from "./SimplifiedPiece";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;
  stalemate: boolean;
  draw: boolean;
  moves: Move[];
  boardHistory: { [key: string]: number };

  constructor(
    pieces: Piece[],
    totalTurns: number,
    moves: Move[],
    boardHistory: { [key: string]: number }
  ) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
    this.stalemate = false;
    this.draw = false;
    this.moves = moves;
    this.boardHistory = boardHistory;
  }

  // Returns the team whose turn it is
  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
  }

  /**
   * Calculates all valid moves for every piece on the board,
   * adds castling moves for kings, and checks for endgame conditions.
   */
  calculateAllMoves() {
    // Set possible moves for every piece
    this.pieces.forEach((piece) => {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    });

    // Append castling moves for kings
    this.pieces
      .filter((p) => p.isKing && p.possibleMoves)
      .forEach((king) => {
        king.possibleMoves = [
          ...(king.possibleMoves || []),
          ...getCastlingMoves(king, this.pieces),
        ];
      });

    // Remove moves that leave the king in check
    this.checkCurrentTeamMoves();

    // Collect enemy moves (flattened)
    const enemyMoves = this.pieces
      .filter((p) => p.team !== this.currentTeam)
      .flatMap((p) => p.possibleMoves || []);

    // Clear moves for non-active team
    this.pieces
      .filter((p) => p.team !== this.currentTeam)
      .forEach((p) => (p.possibleMoves = []));

    // Check draw and threefold repetition
    this.checkForDraw();
    this.checkForThreeFoldRepitition();

    // If current team has no moves, check for stalemate or checkmate
    if (
      !this.pieces.filter(
        (p) => p.team === this.currentTeam && p.possibleMoves?.length
      ).length
    ) {
      this.checkForStalemate(enemyMoves);
    }
  }

  /**
   * Simulates each move for the current team's pieces.
   * Removes moves that leave the king in check.
   */
  checkCurrentTeamMoves() {
    this.pieces
      .filter((p) => p.team === this.currentTeam && p.possibleMoves)
      .forEach((piece) => {
        piece.possibleMoves = piece.possibleMoves?.filter((move) => {
          const simBoard = this.clone();
          // Simulate move: remove piece at destination and update piece's position
          simBoard.pieces = simBoard.pieces.filter(
            (p) => !p.samePosition(move)
          );
          const simPiece = simBoard.pieces.find((p) =>
            p.samePiecePosition(piece)
          )!;
          simPiece.position = move.clone();
          // Update enemy moves on the simulated board
          simBoard.pieces
            .filter((p) => p.team !== simBoard.currentTeam)
            .forEach(
              (enemy) =>
                (enemy.possibleMoves = simBoard.getValidMoves(
                  enemy,
                  simBoard.pieces
                ))
            );
          // Check if king is under attack
          const king = simBoard.pieces.find(
            (p) => p.isKing && p.team === simBoard.currentTeam
          )!;
          const inCheck = simBoard.pieces
            .filter((p) => p.team !== simBoard.currentTeam)
            .some((enemy) =>
              enemy.possibleMoves?.some(
                (m) =>
                  m.samePosition(king.position) &&
                  (enemy.isPawn ? m.x !== enemy.position.x : true)
              )
            );
          return !inCheck;
        });
      });
  }

  /**
   * Returns valid moves for a piece based on its type.
   */
  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  /**
   * Executes a move on the board, handling castling, en passant,
   * and normal moves.
   */
  playMove(
    enPassantMove: boolean,
    validMove: boolean,
    playedPiece: Piece,
    destination: Position
  ): boolean {
    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
    const destinationPiece = this.pieces.find((p) =>
      p.samePosition(destination)
    );

    if (
      playedPiece.isKing &&
      destinationPiece?.isRook &&
      destinationPiece.team === playedPiece.team
    ) {
      // Castling: update king and rook positions
      const direction =
        destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
      const newKingX = playedPiece.position.x + direction * 2;
      this.pieces = this.pieces.map((p) => {
        if (p.samePiecePosition(playedPiece)) p.position.x = newKingX;
        else if (p.samePiecePosition(destinationPiece))
          p.position.x = newKingX - direction;
        return p;
      });
    } else if (enPassantMove) {
      // En passant: update moving pawn and remove captured pawn
      this.pieces = this.pieces.reduce((results, p) => {
        if (p.samePiecePosition(playedPiece)) {
          if (p.isPawn) (p as Pawn).enPassant = false;
          p.position = destination.clone();
          p.hasMoved = true;
          results.push(p);
        } else if (
          !p.samePosition(
            new Position(destination.x, destination.y - pawnDirection)
          )
        ) {
          if (p.isPawn) (p as Pawn).enPassant = false;
          results.push(p);
        }
        return results;
      }, [] as Piece[]);
    } else if (validMove) {
      // Normal move: update position and remove any attacked piece
      this.pieces = this.pieces.reduce((results, p) => {
        if (p.samePiecePosition(playedPiece)) {
          if (p.isPawn)
            (p as Pawn).enPassant =
              Math.abs(playedPiece.position.y - destination.y) === 2;
          p.position = destination.clone();
          p.hasMoved = true;
          results.push(p);
        } else if (!p.samePosition(destination)) {
          if (p.isPawn) (p as Pawn).enPassant = false;
          results.push(p);
        }
        return results;
      }, [] as Piece[]);
    } else return false;

    // Record the move and update board moves
    this.moves.push(
      new Move(
        playedPiece.team,
        playedPiece.type,
        playedPiece.position.clone(),
        destination.clone()
      )
    );
    this.calculateAllMoves();
    return true;
  }

  /**
   * Checks for draw conditions based on insufficient material.
   */
  checkForDraw(): void {
    const ourDraw =
      this.pieces.filter((p) => p.team === TeamType.OUR).length === 1 ||
      this.pieces.filter(
        (p) => p.team === TeamType.OUR && (p.isKing || p.isKnight || p.isBishop)
      ).length === 2;
    const oppDraw =
      this.pieces.filter((p) => p.team === TeamType.OPPONENT).length === 1 ||
      this.pieces.filter(
        (p) =>
          p.team === TeamType.OPPONENT && (p.isKing || p.isKnight || p.isBishop)
      ).length === 2;
    if (ourDraw && oppDraw) this.draw = true;
    else if (
      this.pieces.filter((p) => p.team === TeamType.OUR).length === 3 &&
      this.pieces.filter((p) => p.team === TeamType.OUR && p.isKnight)
        .length === 2 &&
      this.pieces.filter((p) => p.team === TeamType.OPPONENT).length === 1
    )
      this.draw = true;
    else if (
      this.pieces.filter((p) => p.team === TeamType.OPPONENT).length === 3 &&
      this.pieces.filter((p) => p.team === TeamType.OPPONENT && p.isKnight)
        .length === 2 &&
      this.pieces.filter((p) => p.team === TeamType.OUR).length === 1
    )
      this.draw = true;
  }

  /**
   * Checks for threefold repetition using a simplified board state.
   */
  checkForThreeFoldRepitition(): void {
    const simplified = JSON.stringify(
      this.pieces.map((p) => new SimplifiedPiece(p))
    );
    this.boardHistory[simplified] = (this.boardHistory[simplified] || 0) + 1;
    if (this.boardHistory[simplified] === 3) this.draw = true;
  }

  /**
   * Checks for stalemate or checkmate by verifying if enemy moves
   * can target the current team's king.
   */
  checkForStalemate(enemyMoves: (Position | undefined)[]): void {
    const kingPos = this.pieces.find(
      (p) => p.isKing && p.team === this.currentTeam
    )!.position;
    if (enemyMoves.some((m) => m?.samePosition(kingPos)))
      this.winningTeam =
        this.currentTeam === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
    else this.stalemate = true;
  }

  /**
   * Creates a deep clone of the board.
   */
  clone(): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      this.totalTurns,
      this.moves.map((m) => m.clone()),
      this.boardHistory
    );
  }
}
