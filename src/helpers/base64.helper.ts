import fs from 'fs';
import path from 'path';

const storeFile = async (buffer: Buffer, imageName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(imageName, buffer, 'binary', err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const StoreBase64Image = async (base64String: string): Promise<string | null> => {
  try {
    const buffer = Buffer.from(base64String, 'base64');
    const imageName = path.join(__dirname, '../assets', `image-${Date.now()}.png`);

    await storeFile(buffer, imageName);
    return imageName;
  } catch (error) {
    return null;
  }
};
