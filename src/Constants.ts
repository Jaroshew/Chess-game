import { Board } from "./Models/Board";
import { Pawn } from "./Models/Pawn";
import { Piece } from "./Models/Piece";
import { Position } from "./Models/Position";
import { PieceType, TeamType } from "./Types";

// Chessboard grid settings
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const GRID_SIZE = 100;

/**
 * Creates an array of chess pieces for a given team
 * @param {TeamType} team - The team type (OUR/OPPONENT)
 * @param {number} pawnRow - The row index for pawns
 * @param {number} mainRow - The row index for major pieces
 * @returns {Piece[]} - Array of chess pieces for the given team
 */
const createTeamPieces = (
  team: TeamType,
  pawnRow: number,
  mainRow: number
): Piece[] => [
  new Piece(new Position(0, mainRow), PieceType.ROOK, team, false),
  new Piece(new Position(1, mainRow), PieceType.KNIGHT, team, false),
  new Piece(new Position(2, mainRow), PieceType.BISHOP, team, false),
  new Piece(new Position(3, mainRow), PieceType.QUEEN, team, false),
  new Piece(new Position(4, mainRow), PieceType.KING, team, false),
  new Piece(new Position(5, mainRow), PieceType.BISHOP, team, false),
  new Piece(new Position(6, mainRow), PieceType.KNIGHT, team, false),
  new Piece(new Position(7, mainRow), PieceType.ROOK, team, false),
  ...Array.from(
    { length: 8 },
    (_, i) => new Pawn(new Position(i, pawnRow), team, false)
  ),
];

// Initialize the chessboard with both teams' pieces
export const initialBoard: Board = new Board(
  [
    ...createTeamPieces(TeamType.OPPONENT, 6, 7),
    ...createTeamPieces(TeamType.OUR, 1, 0),
  ],
  1, // Turn counter
  [], // Move history (empty initially)
  {} // Other board data (empty initially)
);

// Calculate all possible moves for the initial board state
initialBoard.calculateAllMoves();