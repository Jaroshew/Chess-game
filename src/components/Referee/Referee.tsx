import { useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../Models";
import { Board } from "../../Models/Board";
import { Pawn } from "../../Models/Pawn";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";
import "./Referee.css";

export default function Referee() {
  // State for board, promotion pawn, and modal message
  const [board, setBoard] = useState<Board>(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [modalMessage, setModalMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const endgameModalRef = useRef<HTMLDivElement>(null);

  /**
   * Handles moving a piece. Checks turn order, valid moves (including en passant),
   * updates the board, and opens the promotion modal if needed.
   */
  function playMove(playedPiece: Piece, destination: Position): boolean {
    if (!playedPiece.possibleMoves) return false;
    if (
      (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) ||
      (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)
    )
      return false;

    const validMove = playedPiece.possibleMoves.some((m) =>
      m.samePosition(destination)
    );
    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    let playedMoveIsValid = false;
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns++;
      // Execute the move on the cloned board
      playedMoveIsValid = clonedBoard.playMove(
        enPassantMove,
        validMove,
        playedPiece,
        destination
      );
      checkForEndGame(clonedBoard);
      return clonedBoard;
    });

    // Open promotion modal if pawn reaches the promotion row
    const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn(() => {
        const clonedPiece = playedPiece.clone();
        clonedPiece.position = destination.clone();
        return clonedPiece;
      });
    }
    return playedMoveIsValid;
  }

  // Determines if a pawn move qualifies as an en passant capture.
  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;
    if (type === PieceType.PAWN) {
      const dx = desiredPosition.x - initialPosition.x;
      const dy = desiredPosition.y - initialPosition.y;
      if (Math.abs(dx) === 1 && dy === pawnDirection) {
        return Boolean(
          board.pieces.find(
            (p) =>
              p.position.x === desiredPosition.x &&
              p.position.y === desiredPosition.y - pawnDirection &&
              p.isPawn &&
              (p as Pawn).enPassant
          )
        );
      }
    }
    return false;
  }

  // Promotes a pawn to the selected piece type.
  function promotePawn(pieceType: PieceType) {
    if (!promotionPawn) return;
    setBoard(() => {
      const clonedBoard = board.clone();
      // Replace the pawn with the new piece using map for brevity
      clonedBoard.pieces = clonedBoard.pieces.map((piece) =>
        piece.samePiecePosition(promotionPawn)
          ? new Piece(piece.position.clone(), pieceType, piece.team, true)
          : piece
      );
      clonedBoard.calculateAllMoves();
      checkForEndGame(clonedBoard);
      return clonedBoard;
    });
    modalRef.current?.classList.add("hidden");
  }

  // Returns a shorthand team identifier for promotion images ("w" or "b")
  const promotionTeamType = () =>
    promotionPawn?.team === TeamType.OUR ? "w" : "b";

  // Resets the game by hiding the endgame modal and resetting the board
  function restartGame() {
    endgameModalRef.current?.classList.add("hidden");
    setBoard(initialBoard.clone());
  }

  /**
   * Checks board status for draw, stalemate, or win conditions,
   * then displays the endgame modal if needed.
   */
function checkForEndGame(currentBoard: Board) {
  if (currentBoard.draw) {
    setModalMessage("It's a draw!");
    endgameModalRef.current?.classList.remove("hidden");
  } else if (currentBoard.stalemate) {
    setModalMessage("It's a stalemate!");
    endgameModalRef.current?.classList.remove("hidden");
  } else if (currentBoard.winningTeam !== undefined) {
    setModalMessage(
      `The winning team is ${
        currentBoard.winningTeam === TeamType.OUR ? "white" : "black"
      }!`
    );
    endgameModalRef.current?.classList.remove("hidden");
  }
}

  // Render JSX: Pawn promotion modal, endgame modal, chessboard, and game info
  return (
    <>
      {/* Promotion Modal */}
      <div className="modal hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            alt="rook"
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.svg`}
          />
          <img
            alt="bishop"
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.svg`}
          />
          <img
            alt="knight"
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.svg`}
          />
          <img
            alt="queen"
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.svg`}
          />
        </div>
      </div>

      {/* Endgame Modal */}
      <div className="modal hidden" ref={endgameModalRef}>
        <div className="modal-body">
          <div className="checkmate-body">
            <span>{modalMessage}</span>
            <button onClick={restartGame}>Play again</button>
          </div>
        </div>
      </div>

      <main>
        <Chessboard playMove={playMove} pieces={board.pieces} />
        <div className="information">
          <p>Total turns: {board.totalTurns}</p>
          <p>
            Current team:{" "}
            {board.currentTeam === TeamType.OPPONENT ? "black" : "white"}
          </p>
          <div className="moves">
            {board.moves.map((m, i) => (
              <p key={i}>{m.toMessage()}</p>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}