import { useEffect, useState } from "react";
import "./Snowfall.css"; 

const SnowfallEffect = ({ count = 30 }) => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const newFlakes = [];
    for (let i = 0; i < count; i++) {
      newFlakes.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setFlakes(newFlakes);
  }, [count]);

  return (
    <div className="snowfall-container">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default SnowfallEffect;
