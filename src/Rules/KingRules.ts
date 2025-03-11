import { Piece, Position } from "../Models";
import { TeamType } from "../Types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

/**
 * Checks if the king can move to the desired position.
 * @param {Position} initialPosition - The starting position of the king.
 * @param {Position} desiredPosition - The desired position to move to.
 * @param {TeamType} team - The team color of the king.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the move is valid, otherwise false.
 */
export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  // Determine the movement direction
  const deltaX = Math.sign(desiredPosition.x - initialPosition.x);
  const deltaY = Math.sign(desiredPosition.y - initialPosition.y);

  // King moves one square in any direction
  const nextPosition = new Position(
    initialPosition.x + deltaX,
    initialPosition.y + deltaY
  );

  return (
    nextPosition.samePosition(desiredPosition) &&
    tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
  );
};

/**
 * Generates all possible legal moves for the king.
 * @param {Piece} king - The king piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible positions the king can move to.
 */
export const getPossibleKingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // The eight possible moves for a king (one square in any direction)
  const moveOffsets = [
    { x: 0, y: 1 }, // Up
    { x: 0, y: -1 }, // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }, // Right
    { x: -1, y: 1 }, // Top-left
    { x: 1, y: 1 }, // Top-right
    { x: -1, y: -1 }, // Bottom-left
    { x: 1, y: -1 }, // Bottom-right
  ];

  for (const offset of moveOffsets) {
    const destination = new Position(
      king.position.x + offset.x,
      king.position.y + offset.y
    );

    if (
      destination.x >= 0 &&
      destination.x <= 7 &&
      destination.y >= 0 &&
      destination.y <= 7 &&
      tileIsEmptyOrOccupiedByOpponent(destination, boardState, king.team)
    ) {
      possibleMoves.push(destination);
    }
  }

  return possibleMoves;
};

/**
 * Calculates possible castling moves for the king.
 * @param {Piece} king - The king piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible castling moves.
 */
export const getCastlingMoves = (
  king: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Castling is not possible if the king has moved
  if (king.hasMoved) return possibleMoves;

  // Get the unmoved rooks from the king's team
  const rooks = boardState.filter(
    (p) => p.isRook && p.team === king.team && !p.hasMoved
  );

  for (const rook of rooks) {
    const direction = rook.position.x > king.position.x ? 1 : -1;
    const adjacentPosition = new Position(
      king.position.x + direction,
      king.position.y
    );

    // Ensure the rook can move to the adjacent square of the king
    if (!rook.possibleMoves?.some((m) => m.samePosition(adjacentPosition)))
      continue;

    // Check if any enemy piece can attack the spaces between the king and the rook
    const concerningTiles = rook.possibleMoves.filter(
      (m) => m.y === king.position.y
    );
    const enemyPieces = boardState.filter((p) => p.team !== king.team);

    let isSafe = true;

    for (const enemy of enemyPieces) {
      if (!enemy.possibleMoves) continue;

      for (const move of enemy.possibleMoves) {
        if (
          king.position.samePosition(move) ||
          concerningTiles.some((t) => t.samePosition(move))
        ) {
          isSafe = false;
          break;
        }
      }

      if (!isSafe) break;
    }

    if (isSafe) possibleMoves.push(rook.position.clone());
  }

  return possibleMoves;
};