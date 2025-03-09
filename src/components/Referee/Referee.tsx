import { useEffect, useRef, useState } from "react";
import {
  initialBoardState,
  PieceType,
  samePosition,
  TeamType,
} from "../../Constants";
import { Piece, Position } from "../../Models";
import {
  PawnRules,
  BishopRules,
  KnightRules,
  RookRules,
  QueenRules,
  KingRules,
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
} from "../../Rules";
import Chessboard from "../Chessboard/Chessboard";

export default function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece | undefined>(
    undefined
  );
  const [isPromotionVisible, setPromotionVisible] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update possible moves for all pieces
  function updatePossibleMoves() {
    setPieces((currentPieces) =>
      currentPieces.map((p) => ({
        ...p,
        possibleMoves: getValidMoves(p, currentPieces),
      }))
    );
  }

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  // Handle piece movement (including captures, en passant, and promotion)
  function playMove(playedPiece: Piece, destination: Position): boolean {
    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );
    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );
    const pawnDirection = playedPiece.team === TeamType.WHITE ? 1 : -1;

    if (enPassantMove) {
      // Process en passant move
      const updatedPieces = pieces
        .map((piece) => {
          if (samePosition(piece.position, playedPiece.position)) {
            // Update moving pawn
            return {
              ...piece,
              enPassant: false,
              position: new Position(destination.x, destination.y),
            };
          }
          // Remove captured pawn (located behind destination)
          if (
            samePosition(
              piece.position,
              new Position(destination.x, destination.y - pawnDirection)
            )
          ) {
            return null;
          }
          // Reset en passant flag for other pawns
          if (piece.type === PieceType.PAWN) {
            return { ...piece, enPassant: false };
          }
          return piece;
        })
        .filter((p): p is Piece => p !== null);

      const newPieces = updatedPieces.map((p) => ({
        ...p,
        possibleMoves: getValidMoves(p, updatedPieces),
      }));
      setPieces(newPieces);
    } else if (validMove) {
      // Process standard move (including capture)
      const updatedPieces = pieces
        .map((piece) => {
          if (samePosition(piece.position, playedPiece.position)) {
            const newEnPassant =
              piece.type === PieceType.PAWN &&
              Math.abs(playedPiece.position.y - destination.y) === 2;
            const promotionRow = piece.team === TeamType.WHITE ? 7 : 0;
            // Handle promotion
            if (
              piece.type === PieceType.PAWN &&
              destination.y === promotionRow
            ) {
              setPromotionPawn({
                ...piece,
                enPassant: newEnPassant,
                position: new Position(destination.x, destination.y),
              });
              setPromotionVisible(true);
            }
            return {
              ...piece,
              enPassant: newEnPassant,
              position: new Position(destination.x, destination.y),
            };
          }
          // Remove any piece at destination (capture)
          if (
            samePosition(
              piece.position,
              new Position(destination.x, destination.y)
            )
          ) {
            return null;
          }
          // Reset en passant flag for other pawns
          if (piece.type === PieceType.PAWN) {
            return { ...piece, enPassant: false };
          }
          return piece;
        })
        .filter((p): p is Piece => p !== null);

      const newPieces = updatedPieces.map((p) => ({
        ...p,
        possibleMoves: getValidMoves(p, updatedPieces),
      }));
      setPieces(newPieces);
    } else {
      return false;
    }
    return true;
  }

  // Check if the move is an en passant move
  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;
    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        return !!piece;
      }
    }
    return false;
  }

  // Validate move based on specific piece rules
  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = PawnRules(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KNIGHT:
        validMove = KnightRules(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMove = BishopRules(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMove = RookRules(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.QUEEN:
        validMove = QueenRules(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMove = KingRules(initialPosition, desiredPosition, team, pieces);
        break;
    }
    return validMove;
  }

  // Get valid moves for a piece based on its type and board state
  function getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  // Handle pawn promotion selection
  function handlePromotion(pieceType: PieceType) {
    if (!promotionPawn) return;
    const updatedPieces = pieces.map((piece) => {
      if (
        samePosition(piece.position, promotionPawn.position) &&
        piece.type === PieceType.PAWN
      ) {
        const teamSuffix = piece.team === TeamType.WHITE ? "w" : "b";
        return {
          ...piece,
          type: pieceType,
          image: `/assets/images/${pieceType.toLowerCase()}_${teamSuffix}.svg`,
        };
      }
      return piece;
    });
    updatePossibleMoves();
    setPieces(updatedPieces);
    setPromotionVisible(false);
  }

  return (
    <>
      {isPromotionVisible && (
        <div id="pawn-promotion" className="show" ref={modalRef}>
          <div className="promotion-window">
            <button onClick={() => handlePromotion(PieceType.QUEEN)}>
              Queen
            </button>
            <button onClick={() => handlePromotion(PieceType.ROOK)}>
              Rook
            </button>
            <button onClick={() => handlePromotion(PieceType.BISHOP)}>
              Bishop
            </button>
            <button onClick={() => handlePromotion(PieceType.KNIGHT)}>
              Knight
            </button>
          </div>
        </div>
      )}
      <Chessboard playMove={playMove} pieces={pieces} />
    </>
  );
}
