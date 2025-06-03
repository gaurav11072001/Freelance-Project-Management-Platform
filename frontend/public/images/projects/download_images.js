const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600',
  'https://images.unsplash.com/photo-1522071820081-009c2f6c0384?w=600',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
  'https://images.unsplash.com/photo-1497366811353-6870744d04ed?w=600',
];

const downloadDir = path.join(__dirname, 'project_images');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

images.forEach((url, index) => {
  const fileName = `project${index + 1}.jpg`;
  const filePath = path.join(downloadDir, fileName);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${fileName}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});

console.log('Download complete!');
