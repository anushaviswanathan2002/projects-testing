import "../styles/Card.css";

export default function Card({ card, onClick }) {
  const cls = [
    "card",
    card.flipped || card.matched ? "flipped" : "",
    card.matched ? "matched" : "",
  ].join(" ");

  return (
    <div className={cls} onClick={onClick}>
      <div className="card-inner">
        <div className="card-back">❓</div>
        <div className="card-front">{card.emoji}</div>
      </div>
    </div>
  );
}
