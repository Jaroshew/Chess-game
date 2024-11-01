import { PieceType, TeamType, Piece} from "../Chessboard/Chessboard";

export default class Referee {
  // Checking if tile is occupied
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find ((p) => p.x === x && p.y === y);

    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  isValidMove(
    px: number, // px Previous x location
    py: number, // py Previous y location
    x: number, // x New x location
    y: number, // y New y location
    type: PieceType, // Type Type of the piece
    team: TeamType, // Team of the piece
    boardState: Piece[] // Current state of the board
  ): boolean {
    console.log("Referee is checking the move...");
    console.log(`Previous location: (${px}, ${py})`);
    console.log(`Current location: (${x}, ${y})`);
    console.log(`Piece type: ${type}`);
    console.log(`Team: ${team}`);
  
    if (type === PieceType.PAWN) {
      const direction = team === TeamType.WHITE ? 1 : -1;  // 1 for White, -1 for Black
      const startRow = team === TeamType.WHITE ? 1 : 6;    // Starting row: 1 for White, 6 for Black
  
    // Check single-step forward move
    if (px === x && y - py === direction && !this.tileIsOccupied(x, y, boardState)) {
        return true;
      }
  
      // Check two-step move if path is clear
    if (px === x && py === startRow && y - py === 2 * direction &&
        !this.tileIsOccupied(x, py + direction, boardState) &&
        !this.tileIsOccupied(x, y, boardState)) {
      return true;
    }
  }
  
  return false;
  }
}