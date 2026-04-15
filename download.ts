import fs from 'fs';
import path from 'path';
import https from 'https';

const url = 'https://ais-dev-gknsin45thqjnkhvwlhekb-275467353680.asia-southeast1.run.app/api/files/6230820e-6a93-46c4-94e5-2d8954abc7be/logo.png';
const dest = path.join(process.cwd(), 'public', 'media', 'logo.png');

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location as string, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

downloadFile(url, dest).then(() => console.log('Downloaded logo')).catch(console.error);
