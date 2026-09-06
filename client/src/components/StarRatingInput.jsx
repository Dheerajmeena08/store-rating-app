import { useState } from 'react';

export default function StarRatingInput({ value = 0, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${(hovered || value) >= star ? 'filled' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
