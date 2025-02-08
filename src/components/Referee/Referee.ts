import { PieceType, TeamType, Piece, Position } from "../Tile/Constants";

export default class Referee {
  // Check if the tile is occupied by any piece
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some((p) => p.position.x === x && p.position.y === y);
  }

  // Check if the tile is occupied by an opponent's piece
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

  // Check if the tile is occupied by a friendly piece
  tileIsOccupiedByFriendly(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    return boardState.some(
      (p) => p.position.x === x && p.position.y === y && p.team === team
    );
  }

  // Check if the move is a valid "en passant" capture for a pawn
  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        return !!piece;
      }
    }
    return false;
  }

  // Validate a move for any chess piece
  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {

    // Check if there is a friendly piece at the desired position
    if (
      this.tileIsOccupiedByFriendly(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return false;
    }
    
    switch (type) {
      case PieceType.PAWN: {
        return this.isValidPawnMove(
          initialPosition,
          desiredPosition,
          team,
          boardState
        );
      }

      case PieceType.KNIGHT: {
        return this.isValidKnightMove(initialPosition, desiredPosition);
      }

      case PieceType.BISHOP: {
        return this.isValidBishopMove(
          initialPosition,
          desiredPosition,
          boardState
        );
      }

      case PieceType.ROOK: {
        return this.isValidRookMove(
          initialPosition,
          desiredPosition,
          boardState
        );
      }

      case PieceType.QUEEN: {
        return (
          this.isValidBishopMove(
            initialPosition,
            desiredPosition,
            boardState
          ) ||
          this.isValidRookMove(initialPosition, desiredPosition, boardState)
        );
      }

      case PieceType.KING: {
        return this.isValidKingMove(initialPosition, desiredPosition);
      }

      default:
        return false;
    }
  }

  // Check if a pawn move is valid
  private isValidPawnMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const specialRow = team === TeamType.WHITE ? 1 : 6;
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    // Move forward by 2 squares from initial position
    if (
      initialPosition.x === desiredPosition.x &&
      initialPosition.y === specialRow &&
      desiredPosition.y - initialPosition.y === 2 * pawnDirection &&
      !this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) &&
      !this.tileIsOccupied(
        desiredPosition.x,
        desiredPosition.y - pawnDirection,
        boardState
      )
    ) {
      return true;
    }

    // Move forward by 1 square
    if (
      initialPosition.x === desiredPosition.x &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      !this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)
    ) {
      return true;
    }

    // Capture diagonally
    if (
      Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      this.tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    // En passant
    return this.isEnPassantMove(
      initialPosition,
      desiredPosition,
      PieceType.PAWN,
      team,
      boardState
    );
  }

  // Check if a knight move is valid
  private isValidKnightMove(
    initialPosition: Position,
    desiredPosition: Position
  ): boolean {
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    return knightMoves.some(
      ([dx, dy]) =>
        initialPosition.x + dx === desiredPosition.x &&
        initialPosition.y + dy === desiredPosition.y
    );
  }

  // Check if a bishop move is valid
  private isValidBishopMove(
    initialPosition: Position,
    desiredPosition: Position,
    boardState: Piece[]
  ): boolean {
    if (
      Math.abs(desiredPosition.x - initialPosition.x) !==
      Math.abs(desiredPosition.y - initialPosition.y)
    ) {
      return false;
    }

    const dx = desiredPosition.x > initialPosition.x ? 1 : -1;
    const dy = desiredPosition.y > initialPosition.y ? 1 : -1;
    let x = initialPosition.x + dx;
    let y = initialPosition.y + dy;

    while (x !== desiredPosition.x && y !== desiredPosition.y) {
      if (this.tileIsOccupied(x, y, boardState)) return false;
      x += dx;
      y += dy;
    }

    return true;
  }

  // Check if a rook move is valid
  private isValidRookMove(
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

  // Check if a king move is valid
  private isValidKingMove(
    initialPosition: Position,
    desiredPosition: Position
  ): boolean {
    return (
      Math.abs(desiredPosition.x - initialPosition.x) <= 1 &&
      Math.abs(desiredPosition.y - initialPosition.y) <= 1
    );
  }
}