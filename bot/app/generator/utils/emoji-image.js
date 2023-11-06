import fs from 'node:fs';

const fileList = {
  apple: './assets/emoji/emoji-apple-image.json',
  google: './assets/emoji/emoji-google-image.json',
  twitter: './assets/emoji/emoji-twitter-image.json',
  joypixels: './assets/emoji/emoji-joypixels-image.json',
  blob: './assets/emoji/emoji-blob-image.json',
};

const emojiImageByBrand = {
  apple: [],
  google: [],
  twitter: [],
  joypixels: [],
  blob: [],
}

for (const fileName in fileList) {
  emojiImageByBrand[fileName] = JSON.parse(fs.readFileSync(fileList[fileName]));
}

export default emojiImageByBrand;
