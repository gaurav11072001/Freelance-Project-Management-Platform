const fs = require('fs');
const https = require('https');
const path = require('path');

// URL for a high-quality freelance platform hero image
const imageUrl = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80';
const outputPath = path.join(__dirname, 'freelance-platform-hero.jpg');

// Download the image
const file = fs.createWriteStream(outputPath);
https.get(imageUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`Downloaded hero image to: ${outputPath}`);
  });
}).on('error', (err) => {
  fs.unlink(outputPath, () => {});
  console.error(`Error downloading image: ${err.message}`);
});
