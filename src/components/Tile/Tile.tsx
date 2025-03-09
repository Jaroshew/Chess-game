import "./Tile.css";

interface Props {
  image?: string;
  coordinate: number;
  highlight: boolean;
}

export default function Tile({ coordinate, image, highlight }: Props) {
  const className: string = [
    "tile",
    coordinate % 2 === 0 && "black-tile",
    coordinate % 2 !== 0 && "white-tile",
    highlight && "tile-highlight",
    image && "chess-piece-tile",
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
