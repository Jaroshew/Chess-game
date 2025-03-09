import { PieceType, samePosition, TeamType } from "../Constants";
import { Piece, Position } from "../Models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

// Helper function to check if the pawn's move is valid
const isValidPawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = team === TeamType.WHITE ? 1 : -1;

  const moveDistance = desiredPosition.y - initialPosition.y;
  const moveX = Math.abs(desiredPosition.x - initialPosition.x);

  // Normal 1-square move
  if (
    initialPosition.x === desiredPosition.x &&
    moveDistance === pawnDirection
  ) {
    return !tileIsOccupied(desiredPosition, boardState);
  }

  // Special 2-square move from starting position
  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    moveDistance === 2 * pawnDirection
  ) {
    const oneSquareAhead = new Position(
      desiredPosition.x,
      desiredPosition.y - pawnDirection
    );
    return (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied(oneSquareAhead, boardState)
    );
  }

  // Capture moves (diagonal 1-square move)
  if (moveX === 1 && moveDistance === pawnDirection) {
    return tileIsOccupiedByOpponent(desiredPosition, boardState, team);
  }

  return false;
};

export const PawnRules = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  return isValidPawnMove(initialPosition, desiredPosition, team, boardState);
};

export const getPossiblePawnMoves = (
  pawn: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const specialRow = pawn.team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.WHITE ? 1 : -1;

  // Normal 1-square move
  const normalMove = new Position(
    pawn.position.x,
    pawn.position.y + pawnDirection
  );
  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    // Special 2-square move from starting position
    if (pawn.position.y === specialRow) {
      const specialMove = new Position(
        normalMove.x,
        normalMove.y + pawnDirection
      );
      if (!tileIsOccupied(specialMove, boardState)) {
        possibleMoves.push(specialMove);
      }
    }
  }

  // Diagonal attacks (upper left and right)
  const upperLeftAttack = new Position(
    pawn.position.x - 1,
    pawn.position.y + pawnDirection
  );
  const upperRightAttack = new Position(
    pawn.position.x + 1,
    pawn.position.y + pawnDirection
  );
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((p) =>
      samePosition(p.position, leftPosition)
    );
    if (leftPiece?.enPassant) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((p) =>
      samePosition(p.position, rightPosition)
    );
    if (rightPiece?.enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }

  return possibleMoves;
};
