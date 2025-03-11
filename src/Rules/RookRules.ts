import { TeamType } from "../Types";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
} from "./GeneralRules";

/**
 * Checks if the rook can move to the desired position.
 * @param {Position} initialPosition - The starting position of the rook.
 * @param {Position} desiredPosition - The position the rook wants to move to.
 * @param {TeamType} team - The team color of the rook.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the move is valid, otherwise false.
 */
export const rookMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const directionX = Math.sign(desiredPosition.x - initialPosition.x);
  const directionY = Math.sign(desiredPosition.y - initialPosition.y);

  if (directionX !== 0 && directionY !== 0) return false; // Rook moves in a straight line

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
 * Generates all possible legal moves for the rook.
 * @param {Piece} rook - The rook piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible positions the rook can move to.
 */
export const getPossibleRookMoves = (
  rook: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  // Rook movement directions: horizontal and vertical
  const directions = [
    { dx: 1, dy: 0 }, // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 }, // Up
    { dx: 0, dy: -1 }, // Down
  ];

  // Iterate over each direction
  directions.forEach(({ dx, dy }) => {
    for (let i = 1; i < 8; i++) {
      const destination = new Position(
        rook.position.x + i * dx,
        rook.position.y + i * dy
      );

      if (!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else {
        if (
          tileIsEmptyOrOccupiedByOpponent(destination, boardState, rook.team)
        ) {
          possibleMoves.push(destination);
        }
        break;
      }
    }
  });

  return possibleMoves;
};