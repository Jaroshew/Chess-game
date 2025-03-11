import { Piece, Position } from "../Models";
import { TeamType } from "../Types";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

/**
 * Checks if the knight can move to the desired position.
 * @param {Position} initialPosition - The starting position of the knight.
 * @param {Position} desiredPosition - The position the knight wants to move to.
 * @param {TeamType} team - The team color of the knight.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the move is valid, otherwise false.
 */
export const knightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const knightMoves = [
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
  ];

  return knightMoves.some(
    (move) =>
      desiredPosition.samePosition(
        new Position(initialPosition.x + move.x, initialPosition.y + move.y)
      ) && tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
  );
};

/**
 * Generates all possible legal moves for the knight.
 * @param {Piece} knight - The knight piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible positions the knight can move to.
 */
export const getPossibleKnightMoves = (
  knight: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  const knightMoves = [
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
  ];

  for (const move of knightMoves) {
    const destination = new Position(
      knight.position.x + move.x,
      knight.position.y + move.y
    );

    if (
      destination.x >= 0 &&
      destination.x <= 7 &&
      destination.y >= 0 &&
      destination.y <= 7 &&
      tileIsEmptyOrOccupiedByOpponent(destination, boardState, knight.team)
    ) {
      possibleMoves.push(destination);
    }
  }

  return possibleMoves;
};