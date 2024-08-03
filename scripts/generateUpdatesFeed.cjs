const { Feed } = require('feed');
const fs = require('fs');
const path = require('path');

// Read the JSON file
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../updates/_index.json'), 'utf8'));

// Initialize the feed
const feed = new Feed({
  title: 'Vanilla OS Updates',
  description: 'Live feed of Vanilla OS updates and changes.',
  id: 'https://info.vanillaos.org/updates-feed.xml',
  link: 'https://vanillaos.org/',
  language: 'en',
  updated: new Date(),
  feedLinks: {
    atom: 'https://info.vanillaos.org/updates-feed.xml',
  },
  author: {
    name: 'Vanilla OS',
    email: 'info@vanillaos.org',
    link: 'https://vanillaos.org/',
  }
});

// Process the JSON data and add items to the feed
Object.keys(data).forEach((date) => {
  const bugs = data[date].bugs || [];
  const enhancements = data[date].enhancements || [];

  bugs.forEach((bug) => {
    feed.addItem({
      title: `Bug Fix: ${bug.title}`,
      id: bug.link || '',
      link: bug.link || '',
      description: `Affected: ${bug.affected}. Fixed in version: ${bug.fixed || 'N/A'}.`,
      date: new Date(date),
    });
  });

  enhancements.forEach((enhancement) => {
    feed.addItem({
      title: `Enhancement: ${enhancement.title}`,
      id: enhancement.link || '',
      link: enhancement.link || '',
      description: `${enhancement.description || ''} Version: ${enhancement.version || 'N/A'}.`,
      date: new Date(date),
    });
  });
});

// Write the Atom feed to a file
fs.writeFileSync(path.join(__dirname, '../updates-feed.xml'), feed.atom1());

console.log('Atom feed generated.');
