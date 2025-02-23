import { Position, Piece, TeamType } from "../../Tile/Constants";
import { BishopRules } from "./BishopRules";
import { RookRules } from "./RookRules";

export class QueenRules {
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
    return (
      BishopRules.isValidMove(
        initialPosition,
        desiredPosition,
        team,
        boardState,
        isPositionOccupiedBySameTeam,
        tileIsOccupiedByOpponent
      ) ||
      RookRules.isValidMove(
        initialPosition,
        desiredPosition,
        team,
        boardState,
        isPositionOccupiedBySameTeam,
        tileIsOccupiedByOpponent
      )
    );
  }
}