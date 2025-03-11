import { Piece, Position } from "../Models";
import { TeamType } from "../Types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

/**
 * Checks if the bishop can move to the desired position.
 * @param {Position} initialPosition - The bishop's starting position.
 * @param {Position} desiredPosition - The target position.
 * @param {TeamType} team - The bishop's team (OUR/OPPONENT).
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - true if the move is possible, otherwise false.
 */
export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const directions = [
    { dx: 1, dy: 1 }, // Up-right
    { dx: 1, dy: -1 }, // Down-right
    { dx: -1, dy: -1 }, // Down-left
    { dx: -1, dy: 1 }, // Up-left
  ];

  for (const { dx, dy } of directions) {
    for (let i = 1; i < 8; i++) {
      const passedPosition = new Position(
        initialPosition.x + i * dx,
        initialPosition.y + i * dy
      );

      // If the desired position is reached, check if it's a valid move
      if (passedPosition.samePosition(desiredPosition)) {
        return tileIsEmptyOrOccupiedByOpponent(
          passedPosition,
          boardState,
          team
        );
      }
      // Stop if a piece is blocking the way
      if (tileIsOccupied(passedPosition, boardState)) break;
    }
  }
  return false;
};

/**
 * Returns a list of possible moves for the bishop.
 * @param {Piece} bishop - The bishop piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of valid move positions.
 */
export const getPossibleBishopMoves = (
  bishop: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const directions = [
    { dx: 1, dy: 1 }, // Up-right
    { dx: 1, dy: -1 }, // Down-right
    { dx: -1, dy: -1 }, // Down-left
    { dx: -1, dy: 1 }, // Up-left
  ];

  for (const { dx, dy } of directions) {
    for (let i = 1; i < 8; i++) {
      const destination = new Position(
        bishop.position.x + i * dx,
        bishop.position.y + i * dy
      );

      // If the tile is not occupied, it's a valid move
      if (!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else {
        // If occupied by an opponent, it's a valid capture move
        if (tileIsOccupiedByOpponent(destination, boardState, bishop.team)) {
          possibleMoves.push(destination);
        }
        break; // Stop if a piece blocks further movement
      }
    }
  }

  return possibleMoves;
};
