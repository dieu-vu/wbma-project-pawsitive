// import React from 'react';

const loginScreenImages = [
  require('../assets/dogSmiling1.jpg'),
  require('../assets/dogSmiling2.jpg'),
  require('../assets/sheepGroup.jpg'),
];

const pickRandomImage = () => {
  const selection = Math.floor(Math.random() * loginScreenImages.length);
  return loginScreenImages[selection];
};

export {pickRandomImage};
