import { PieceType, TeamType } from "../Chessboard/Chessboard";

export default class Referee {
  isValidMove(
    previousX: number,
    previousY: number,
    currentX: number,
    currentY: number,
    type: PieceType,
    team: TeamType,
  ) {
    console.log("Referee is checking if the move is valid");
    console.log(`Previous position: (${previousX}, ${previousY})`);
    console.log(`Current position: (${currentX}, ${currentY})`);
    console.log(`Piece type: ${type}`);
    console.log(`Piece team: ${team}`);

    return false;
  }
}
