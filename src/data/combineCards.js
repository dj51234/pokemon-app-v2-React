const fs = require('fs');
const path = require('path');

const cardsDir = './cards';
const allCards = {};

fs.readdirSync(cardsDir).forEach(file => {
  if (file.endsWith('.json')) {
    const setId = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join(cardsDir, file)));
    allCards[setId] = data;
  }
});

fs.writeFileSync('./allCards.json', JSON.stringify(allCards));
console.log('Done! Created allCards.json');