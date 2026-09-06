export default function StarRatingDisplay({ value }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <div className="stars readonly">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${rounded >= star ? 'filled' : ''}`}>★</span>
      ))}
      <span style={{ marginLeft: 6, fontSize: 13, color: '#6b716e' }}>
        {value ? Number(value).toFixed(1) : 'No ratings yet'}
      </span>
    </div>
  );
}
