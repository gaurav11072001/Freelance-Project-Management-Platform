const fs = require('fs');
const https = require('https');
const path = require('path');

// URL for a high-quality freelance collaboration image
const imageUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80';
const outputPath = path.join(__dirname, 'freelance-collaboration.jpg');

// Download the image
const file = fs.createWriteStream(outputPath);
https.get(imageUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`Downloaded collaboration image to: ${outputPath}`);
  });
}).on('error', (err) => {
  fs.unlink(outputPath, () => {});
  console.error(`Error downloading image: ${err.message}`);
});
