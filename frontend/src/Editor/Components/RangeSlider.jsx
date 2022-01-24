import React, { useEffect, useRef, useState } from 'react';
import { resolveReferences } from '@/_helpers/utils';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export const RangeSlider = function RangeSlider({
  component,
  currentState,
  height,
  properties,
  styles,
  onComponentOptionsChanged,
}) {
  const { value, min, max, enableTwoHandle } = properties;
  const { trackColor, handleColor, lineColor, visibility } = styles;
  const sliderRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);

  const computedStyles = {
    height,
    display: visibility ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px 2px',
  };

  useEffect(() => {
    setSliderValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    onComponentOptionsChanged(component, [
      ['value', resolveReferences(enableTwoHandle ? toArray(value) : value, currentState)],
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderRef.current, enableTwoHandle]);

  const toArray = (data) => (Array.isArray(data) ? data : [data, max]);

  useEffect(() => {
    onComponentOptionsChanged(component, [['value', resolveReferences(sliderValue, currentState)]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue]);

  const onChange = (value) => setSliderValue(value);

  const rangeStyles = {
    handleStyle: toArray(sliderValue).map(() => {
      return {
        backgroundColor: handleColor,
        borderColor: handleColor,
      };
    }),
    trackStyle: toArray(sliderValue).map(() => {
      return { backgroundColor: trackColor };
    }),
    railStyle: { backgroundColor: lineColor },
  };

  return (
    <div style={computedStyles} className="range-slider">
      {enableTwoHandle ? (
        <Range
          min={min}
          max={max}
          defaultValue={toArray(sliderValue)}
          onChange={onChange}
          value={toArray(sliderValue)}
          ref={sliderRef}
          trackStyle={rangeStyles.trackStyle}
          railStyle={rangeStyles.railStyle}
          handleStyle={rangeStyles.handleStyle}
        />
      ) : (
        <Slider
          min={min}
          max={max}
          defaultValue={sliderValue}
          value={sliderValue}
          ref={sliderRef}
          onChange={onChange}
          trackStyle={{ backgroundColor: trackColor }}
          railStyle={{ backgroundColor: lineColor }}
          handleStyle={{
            backgroundColor: handleColor,
            borderColor: handleColor,
          }}
        />
      )}
    </div>
  );
};
