import "./Tile.css";

interface Props {
  coordinate: number; // The tile's coordinate for color
  image?: string; // Optional image for the piece
}

// Tile component renders a chessboard square
export default function Tile({ coordinate, image }: Props) {
  if (coordinate % 2 === 0) {
    // Render a black tile with an optional piece image
    return (
      <div className="tile black-tile">
        {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
      </div>
    );
  } else {
    return (
      <div className="tile white-tile">
        {image && < div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
        </div>
    );
  }
}