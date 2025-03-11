import { Piece, Position } from "../Models";
import { TeamType } from "../Types";

/**
 * Checks if the given position is occupied by any piece.
 * @param {Position} position - The position to check.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the position is occupied, otherwise false.
 */
export const tileIsOccupied = (
  position: Position,
  boardState: Piece[]
): boolean => {
  return boardState.some((piece) => piece.samePosition(position));
};

/**
 * Checks if the given position is occupied by an opponent's piece.
 * @param {Position} position - The position to check.
 * @param {Piece[]} boardState - The current state of the board.
 * @param {TeamType} team - The player's team.
 * @returns {boolean} - True if occupied by an opponent, otherwise false.
 */
export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  return boardState.some(
    (piece) => piece.samePosition(position) && piece.team !== team
  );
};

/**
 * Checks if a tile is either empty or occupied by an opponent.
 * @param {Position} position - The position to check.
 * @param {Piece[]} boardState - The current state of the board.
 * @param {TeamType} team - The player's team.
 * @returns {boolean} - True if the tile is empty or occupied by an opponent, otherwise false.
 */
export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  return (
    !tileIsOccupied(position, boardState) ||
    tileIsOccupiedByOpponent(position, boardState, team)
  );
};