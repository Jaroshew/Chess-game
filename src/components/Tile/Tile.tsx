import "./Tile.css";

interface Props {
  coordinate: number; // The tile's coordinate for color
  image?: string; // Optional image for the piece
  highlight: boolean;
}

// Tile component renders a chessboard square
export default function Tile({ coordinate, image, highlight }: Props) {
  const className: string = [
    "tile",
    coordinate % 2 === 0 && "black-tile",
    coordinate % 2 !== 0 && "white-tile",
    highlight && "tile-highlight",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="chess-piece"
        ></div>
      )}
    </div>
  );
}