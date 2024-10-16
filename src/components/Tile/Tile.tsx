import './Tile.css';

interface Props {
  coordinate: number;
}

export default function Tile({coordinate}: Props) {
    if(coordinate % 2 == 0) {
      return <div className="tile black-tile"></div>
    } else {
      return <div className="tile white-tile"></div>
    }
}