import React, { useEffect, useRef } from 'react';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { resolveReferences } from '@/_helpers/utils';

export const RangeSlider = function RangeSlider({
  component,
  currentState,
  height,
  properties,
  styles,
  onComponentOptionsChanged,
}) {
  const { value, min, max, enableTwoHandle, enableConnect } = properties;
  const { lineColor, handleColor, connectColor, visibility } = styles;
  const sliderRef = useRef(null);

  const computedStyles = {
    height,
    display: visibility ? '' : 'none',
  };

  const toArray = (data) => (Array.isArray(data) ? data : [data, max]);

  const setConnect = () => {
    if (enableConnect) {
      if (enableTwoHandle) {
        return [true, false, true];
      }
      return 'lower';
    }
  };

  const setSliderStyles = () => {
    sliderRef.current.querySelector('.noUi-base').style.background = lineColor;
    sliderRef.current.querySelector('.noUi-handle').style.background = handleColor;
    enableConnect && (sliderRef.current.querySelector('.noUi-connect').style.background = connectColor);
  };

  async function initializeSlider() {
    sliderRef.current.noUiSlider && sliderRef.current.noUiSlider.destroy();
    noUiSlider.create(sliderRef.current, {
      start: enableTwoHandle ? toArray(value) : Array.isArray(value) ? value[0] : value,
      range: {
        min: 0,
        max: 100,
      },
      connect: setConnect(),
    });
    sliderRef.current.noUiSlider.on('set', () => {
      onComponentOptionsChanged(component, [
        ['value', resolveReferences(sliderRef.current.noUiSlider.get(true), currentState)],
      ]);
    });
    setSliderStyles();
  }

  useEffect(() => {
    async function setup() {
      await initializeSlider();
      onComponentOptionsChanged(component, [
        ['value', resolveReferences(sliderRef.current.noUiSlider.get(true), currentState)],
      ]);
    }
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTwoHandle, enableConnect]);

  useEffect(() => {
    sliderRef.current.noUiSlider.set(enableTwoHandle ? toArray(value) : value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Update min and max
  useEffect(() => {
    sliderRef.current.noUiSlider.updateOptions({
      range: {
        min: min,
        max: max,
      },
    });
  }, [min, max]);

  useEffect(() => {
    setSliderStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineColor, handleColor, connectColor]);

  return (
    <div style={computedStyles} className="range-slider">
      <div id="slider" ref={sliderRef}></div>
    </div>
  );
};
