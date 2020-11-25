/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './Colours.css';

const Colours = ({ currentColour, setCurrentColour }) => {
  const [colours, setColours] = useState([]);

  const handleClick = (colour) => {
    if (!colours.includes(currentColour)) {
      const newColours = colours.slice(0, 3);
      newColours.unshift(currentColour);
      setColours(newColours);
    }
    setCurrentColour(colour);
  };

  return (
    <div className="flex">
      <input
        type="color"
        value={currentColour}
        onChange={(e) => handleClick(e.target.value)}
      />

      {colours.map((colour, index) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="colour-tile"
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={{ backgroundColor: colour }}
          onClick={() => handleClick(colour)}
        />
      ))}
    </div>
  );
};

export default Colours;
