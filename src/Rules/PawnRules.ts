import { TeamType } from "../Types";
import { Piece, Position } from "../Models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Pawn } from "../Models/Pawn";

/**
 * Checks if the pawn can move to the desired position.
 * @param {Position} initialPosition - The starting position of the pawn.
 * @param {Position} desiredPosition - The position the pawn wants to move to.
 * @param {TeamType} team - The team color of the pawn.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {boolean} - True if the move is valid, otherwise false.
 */
export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const startingRow = team === TeamType.OUR ? 1 : 6;
  const pawnDirection = team === TeamType.OUR ? 1 : -1;

  const isOneStepForward =
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection;
  const isTwoStepsForward =
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === startingRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection;

  // Regular move (one step forward)
  if (isOneStepForward && !tileIsOccupied(desiredPosition, boardState)) {
    return true;
  }

  // Double move (only from starting row)
  if (
    isTwoStepsForward &&
    !tileIsOccupied(desiredPosition, boardState) &&
    !tileIsOccupied(
      new Position(desiredPosition.x, desiredPosition.y - pawnDirection),
      boardState
    )
  ) {
    return true;
  }

  // Attack moves (diagonal)
  if (
    Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true; // Regular capture
    }

    // En passant capture
    const adjacentPiece = boardState.find((p) =>
      p.samePosition(new Position(desiredPosition.x, initialPosition.y))
    );
    if (
      adjacentPiece &&
      adjacentPiece instanceof Pawn &&
      (adjacentPiece as Pawn).enPassant
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Generates all possible legal moves for the pawn.
 * @param {Piece} pawn - The pawn piece.
 * @param {Piece[]} boardState - The current state of the board.
 * @returns {Position[]} - An array of possible positions the pawn can move to.
 */
export const getPossiblePawnMoves = (
  pawn: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  const startingRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  const forwardOne = new Position(
    pawn.position.x,
    pawn.position.y + pawnDirection
  );
  const forwardTwo = new Position(forwardOne.x, forwardOne.y + pawnDirection);
  const attackLeft = new Position(
    pawn.position.x - 1,
    pawn.position.y + pawnDirection
  );
  const attackRight = new Position(
    pawn.position.x + 1,
    pawn.position.y + pawnDirection
  );
  const leftPiecePosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPiecePosition = new Position(pawn.position.x + 1, pawn.position.y);

  // Regular forward move
  if (!tileIsOccupied(forwardOne, boardState)) {
    possibleMoves.push(forwardOne);

    // Double move from starting row
    if (
      pawn.position.y === startingRow &&
      !tileIsOccupied(forwardTwo, boardState)
    ) {
      possibleMoves.push(forwardTwo);
    }
  }

  // Capture moves
  [attackLeft, attackRight].forEach((attackPosition) => {
    if (tileIsOccupiedByOpponent(attackPosition, boardState, pawn.team)) {
      possibleMoves.push(attackPosition);
    }
  });

  // En passant
  [
    { attackPosition: attackLeft, adjacentPosition: leftPiecePosition },
    { attackPosition: attackRight, adjacentPosition: rightPiecePosition },
  ].forEach(({ attackPosition, adjacentPosition }) => {
    const adjacentPiece = boardState.find((p) =>
      p.samePosition(adjacentPosition)
    );
    if (
      adjacentPiece &&
      adjacentPiece instanceof Pawn &&
      (adjacentPiece as Pawn).enPassant
    ) {
      possibleMoves.push(attackPosition);
    }
  });

  return possibleMoves;
};