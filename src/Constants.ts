import { Piece } from "./Models/Piece";
import { Position } from "./Models/Position";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export enum PieceType {
  PAWN = "pawn",
  BISHOP = "bishop",
  KNIGHT = "knight",
  ROOK = "rook",
  QUEEN = "queen",
  KING = "king",
}

export enum TeamType {
  WHITE = "w",
  BLACK = "b",
}

// Utility function to create a piece at a given position
const createPiece = (x: number, y: number, type: PieceType, team: TeamType) => {
  return new Piece(new Position(x, y), type, team);
};

// Function to generate the initial state of the board
const createInitialRow = (y: number, team: TeamType) => {
  return [
    createPiece(0, y, PieceType.ROOK, team),
    createPiece(1, y, PieceType.KNIGHT, team),
    createPiece(2, y, PieceType.BISHOP, team),
    createPiece(3, y, PieceType.QUEEN, team),
    createPiece(4, y, PieceType.KING, team),
    createPiece(5, y, PieceType.BISHOP, team),
    createPiece(6, y, PieceType.KNIGHT, team),
    createPiece(7, y, PieceType.ROOK, team),
  ];
};

const createPawnRow = (y: number, team: TeamType) => {
  return Array.from({ length: 8 }, (_, x) =>
    createPiece(x, y, PieceType.PAWN, team)
  );
};

// Generate the initial board state
export const initialBoardState: Piece[] = [
  ...createInitialRow(0, TeamType.WHITE),
  ...createPawnRow(1, TeamType.WHITE),
  ...createPawnRow(6, TeamType.BLACK),
  ...createInitialRow(7, TeamType.BLACK),
];
