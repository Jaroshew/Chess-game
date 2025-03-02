import { Position, Piece, TeamType } from "../../Tile/Constants";

export class PawnRules {
  static isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[],
    isPositionOccupiedBySameTeam: (
      position: Position,
      team: TeamType,
      boardState: Piece[]
    ) => boolean,
    tileIsOccupiedByOpponent: (
      x: number,
      y: number,
      boardState: Piece[],
      team: TeamType
    ) => boolean
  ): boolean {
    const specialRow = team === TeamType.WHITE ? 1 : 6; // Row where a pawn can move two squares
    const pawnDirection = team === TeamType.WHITE ? 1 : -1; // Determines movement direction

    // Moving two squares from starting position
    if (
      initialPosition.x === desiredPosition.x &&
      initialPosition.y === specialRow &&
      desiredPosition.y - initialPosition.y === 2 * pawnDirection &&
      !isPositionOccupiedBySameTeam(desiredPosition, team, boardState) &&
      !tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    // Moving one square forward
    if (
      initialPosition.x === desiredPosition.x &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      !isPositionOccupiedBySameTeam(desiredPosition, team, boardState) &&
      !tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    // Capturing diagonally
    if (
      Math.abs(desiredPosition.x - initialPosition.x) === 1 &&
      desiredPosition.y - initialPosition.y === pawnDirection &&
      tileIsOccupiedByOpponent(
        desiredPosition.x,
        desiredPosition.y,
        boardState,
        team
      )
    ) {
      return true;
    }

    return false;
  }
}

// Get possible moves for a pawn
export const getPossiblePawnMoves = (
  pawn: Piece,
  boardState: Piece[],
  isPositionOccupiedBySameTeam: (
    position: Position,
    team: TeamType,
    boardState: Piece[]
  ) => boolean,
  tileIsOccupiedByOpponent: (
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ) => boolean
): Position[] => {
  const possibleMoves: Position[] = [];

  const specialRow = pawn.team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.WHITE ? 1 : -1;

  // Check one square forward
  if (
    !isPositionOccupiedBySameTeam(
      { x: pawn.position.x, y: pawn.position.y + pawnDirection },
      pawn.team,
      boardState
    ) &&
    !tileIsOccupiedByOpponent(
      pawn.position.x,
      pawn.position.y + pawnDirection,
      boardState,
      pawn.team
    )
  ) {
    possibleMoves.push({
      x: pawn.position.x,
      y: pawn.position.y + pawnDirection,
    });

    // Check two squares forward if on the special row
    if (
      pawn.position.y === specialRow &&
      !isPositionOccupiedBySameTeam(
        { x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 },
        pawn.team,
        boardState
      ) &&
      !tileIsOccupiedByOpponent(
        pawn.position.x,
        pawn.position.y + pawnDirection * 2,
        boardState,
        pawn.team
      )
    ) {
      possibleMoves.push({
        x: pawn.position.x,
        y: pawn.position.y + pawnDirection * 2,
      });
    }
  }

  // Capture diagonally (left and right)
  const captureMoves = [
    { x: pawn.position.x - 1, y: pawn.position.y + pawnDirection },
    { x: pawn.position.x + 1, y: pawn.position.y + pawnDirection },
  ];

  for (const move of captureMoves) {
    if (tileIsOccupiedByOpponent(move.x, move.y, boardState, pawn.team)) {
      possibleMoves.push(move);
    }
  }

  return possibleMoves;
};
