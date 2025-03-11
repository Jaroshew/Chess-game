import { TeamType } from "../Types";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
} from "./GeneralRules";

/**
 * Checks if the queen can move to the desired position.
 * @param {Position} initialPosition - The starting position of the queen.
 * @param {Position} desiredPosition - The position the queen wants to move to.
 * @param {TeamType} team - The team color of the queen.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the move is valid, otherwise false.
 */
export const queenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const directionX = Math.sign(desiredPosition.x - initialPosition.x);
  const directionY = Math.sign(desiredPosition.y - initialPosition.y);

  for (let i = 1; i < 8; i++) {
    const passedPosition = new Position(
      initialPosition.x + i * directionX,
      initialPosition.y + i * directionY
    );

    if (passedPosition.samePosition(desiredPosition)) {
      return tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team);
    }

    if (tileIsOccupied(passedPosition, boardState)) {
      return false;
    }
  }

  return false;
};

/**
 * Generates all possible legal moves for the queen.
 * @param {Piece} queen - The queen piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible positions the queen can move to.
 */
export const getPossibleQueenMoves = (
  queen: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Queen movement directions: horizontal, vertical, and diagonal
  const directions = [
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
    { dx: 1, dy: 1 }, // Upper right diagonal
    { dx: -1, dy: 1 }, // Upper left diagonal
    { dx: 1, dy: -1 }, // Bottom right diagonal
    { dx: -1, dy: -1 }, // Bottom left diagonal
  ];

  // Iterate over each possible direction
  directions.forEach(({ dx, dy }) => {
    for (let i = 1; i < 8; i++) {
      const destination = new Position(
        queen.position.x + i * dx,
        queen.position.y + i * dy
      );

      if (!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else {
        if (
          tileIsEmptyOrOccupiedByOpponent(destination, boardState, queen.team)
        ) {
          possibleMoves.push(destination);
        }
        break;
      }
    }
  });

  return possibleMoves;
};