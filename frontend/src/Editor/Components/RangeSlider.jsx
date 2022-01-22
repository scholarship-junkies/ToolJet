import React, { useEffect, useRef } from 'react';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { resolveReferences } from '@/_helpers/utils';

export const RangeSlider = function RangeSlider({
  component,
  currentState,
  width,
  height,
  properties,
  styles,
  onComponentOptionsChanged,
}) {
  const { value, min, max, enableTwoHandle, enableConnect } = properties;
  const { visibility } = styles;
  const sliderRef = useRef(null);

  const computedStyles = {
    width,
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

  async function initializeSlider() {
    sliderRef.current.noUiSlider && sliderRef.current.noUiSlider.destroy();
    noUiSlider.create(sliderRef.current, {
      start: enableTwoHandle ? toArray(value) : value,
      range: {
        min: 0,
        max: 100,
      },
      connect: setConnect(),
    });
    sliderRef.current.noUiSlider.on('set', (value) => {
      onComponentOptionsChanged(component, [['value', resolveReferences(value, currentState)]]);
    });
  }

  useEffect(() => {
    async function setup() {
      await initializeSlider();
      onComponentOptionsChanged(component, [
        ['value', resolveReferences(sliderRef.current.noUiSlider.get(), currentState)],
      ]);
    }
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTwoHandle, enableConnect]);

  useEffect(() => {
    sliderRef.current.noUiSlider && sliderRef.current.noUiSlider.set(enableTwoHandle ? toArray(value) : value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Update min and max
  useEffect(() => {
    sliderRef.current &&
      sliderRef.current.noUiSlider.updateOptions({
        range: {
          min: min,
          max: max,
        },
      });
  }, [min, max]);

  return (
    <div style={computedStyles}>
      <div id="slider" ref={sliderRef}></div>
    </div>
  );
};
