const fs = require('fs');
const path = require('path');

const cardsDir = './cards';
const slimCards = {};

fs.readdirSync(cardsDir).forEach(file => {
  if (file.endsWith('.json')) {
    const setId = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join(cardsDir, file)));
    
    slimCards[setId] = data.map(card => ({
      id: card.id,
      name: card.name,
      images: card.images,
      rarity: card.rarity,
      subtypes: card.subtypes,
      supertype: card.supertype,
      types: card.types
    }));
  }
});

fs.writeFileSync('./allCardsSlim.json', JSON.stringify(slimCards));
console.log('Done! Check the file size.');