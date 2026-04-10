import React from 'react';
import './TechPatternBackground.css';

const TechPatternBackground = ({ themeColor = 'blue' }) => {
  const themes = {
    blue: {
      gradient: 'linear-gradient(180deg, #071d45 0%, #153d8f 55%, #1f4fd1 100%)',
      lineColor: 'rgba(255, 255, 255, 0.08)',
      glow1: 'rgba(96, 165, 250, 0.2)',
      glow2: 'rgba(56, 189, 248, 0.16)'
    },
    red: {
      gradient: 'linear-gradient(180deg, #2a0a0d 0%, #8b1f28 55%, #c53032 100%)',
      lineColor: 'rgba(255, 255, 255, 0.08)',
      glow1: 'rgba(248, 113, 113, 0.18)',
      glow2: 'rgba(251, 146, 60, 0.14)'
    },
    dark: {
      gradient: 'linear-gradient(180deg, #090b15 0%, #111827 55%, #111827 100%)',
      lineColor: 'rgba(255, 255, 255, 0.07)',
      glow1: 'rgba(148, 163, 184, 0.16)',
      glow2: 'rgba(96, 165, 250, 0.12)'
    }
  };

  const theme = themes[themeColor] || themes.dark;

  return (
    <div
      className="tech-pattern-background-wrapper"
      style={{
        '--pattern-gradient': theme.gradient,
        '--pattern-line': theme.lineColor,
        '--pattern-glow-1': theme.glow1,
        '--pattern-glow-2': theme.glow2
      }}
    >
      <div className="tech-pattern-grid" />
      <div className="tech-pattern-overlay" />
      <div className="tech-pattern-glow glow-1" />
      <div className="tech-pattern-glow glow-2" />
    </div>
  );
};

export default TechPatternBackground;
