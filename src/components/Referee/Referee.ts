import { PieceType, TeamType, Piece} from "../Chessboard/Chessboard";

export default class Referee {
  // Checking if tile is occupied
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some ((p) => p.x === x && p.y === y);
  }

  tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    return boardState.some((p) => p.x === x && p.y === y && p.team !== team);
  }

  isValidMove (
    px: number, // px Previous x location
    py: number, // py Previous y location
    x: number, // x New x location
    y: number, // y New y location
    type: PieceType, // Type Type of the piece
    team: TeamType, // Team of the piece
    boardState: Piece[] // Current state of the board
  ): boolean {
    if (type === PieceType.PAWN) {
      const pawnDirection = team === TeamType.WHITE ? 1 : -1; // 1 for White, -1 for Black
      const startRow = team === TeamType.WHITE ? 1 : 6;       // Starting row: 1 for White, 6 for Black
  
      // Normal move one square forward
      if (px === x && y - py === pawnDirection && !this.tileIsOccupied(x, y, boardState)) {
        return true;
      }
  
      // Move two squares forward from the starting position
      if (px === x && py === startRow && y - py === 2 * pawnDirection &&
          !this.tileIsOccupied(x, py + pawnDirection, boardState) &&
          !this.tileIsOccupied(x, y, boardState)) {
        return true;
      }
  
      // Diagonal attack
      else if (x - px === -1 && y - py === pawnDirection) {
        // Attack in upper or bottom left
        console.log ("upper / bottom left")
        if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      } else if (x - px === 1 && y - py === pawnDirection) {
        // Attack in upper or bottom right
        console.log ("upper / bottom right")
        if (this.tileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      }
    }
  
    return false;
  }
}