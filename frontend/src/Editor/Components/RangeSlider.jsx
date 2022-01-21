import React, { useEffect, useRef } from 'react';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

export const RangeSlider = function RangeSlider({ width, height, properties, styles }) {
  const { value, min, max } = properties;
  const { visibility } = styles;
  const sliderRef = useRef(null);

  const computedStyles = {
    width,
    height,
    display: visibility ? '' : 'none',
    overflowY: 'auto',
  };

  function initializeSlider() {
    noUiSlider.create(sliderRef.current, {
      start: [20, 80],
      range: {
        min: 0,
        max: 100,
      },
    });
  }

  useEffect(() => {
    initializeSlider();
  }, []);

  return (
    <div style={computedStyles}>
      <div id="slider"></div>
    </div>
  );
};
