// Define the chessboard axis
export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
  possibleMoves?: Position[];
}

export interface Position {
  x: number;
  y: number;
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}

export enum TeamType {
  BLACK,
  WHITE,
}

// Chess piece type definition
export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}

// Chess piece type definition
export const initialBoardState: Piece[] = [];

// Add a piece to the board
function addPiece(image: string, x: number, y: number, type: PieceType, team: TeamType) {
  initialBoardState.push({ image, position: { x, y }, type, team });
}

// Major pieces
const majorPieces = [
  { type: PieceType.ROOK, image: "rook", positions: [0, 7] },
  { type: PieceType.KNIGHT, image: "knight", positions: [1, 6] },
  { type: PieceType.BISHOP, image: "bishop", positions: [2, 5] },
  { type: PieceType.QUEEN, image: "queen", positions: [3] },
  { type: PieceType.KING, image: "king", positions: [4] },
];

majorPieces.forEach(({ type, image, positions }) => {
  positions.forEach((x) => {
    addPiece(`assets/images/${image}_w.svg`, x, 0, type, TeamType.WHITE);
    addPiece(`assets/images/${image}_b.svg`, x, 7, type, TeamType.BLACK);
  });
});

// Add pawns
for (let x = 0; x < 8; x++) {
  addPiece("assets/images/pawn_w.svg", x, 1, PieceType.PAWN, TeamType.WHITE);
  addPiece("assets/images/pawn_b.svg", x, 6, PieceType.PAWN, TeamType.BLACK);
}