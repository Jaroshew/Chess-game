import "./Tile.css";

interface Props {
  image?: string;
  number: number;
  highlight: boolean;
}

/**
 * Renders a chessboard tile.
 * Applies background color based on tile number, highlights if needed,
 * and displays a chess piece image if provided.
 */
export default function Tile({ number, image, highlight }: Props) {
  const classes = [
    "tile",
    number % 2 === 0 ? "black-tile" : "white-tile",
    highlight && "tile-highlight",
    image && "chess-piece-tile",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {image && (
        <div
          className="chess-piece"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
    </div>
  );
}