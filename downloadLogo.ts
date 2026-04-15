import fs from 'fs';
import https from 'https';

const url = 'https://ais-dev-gknsin45thqjnkhvwlhekb-275467353680.asia-southeast1.run.app/api/files/6230820e-6a93-46c4-94e5-2d8954abc7be/logo.png';
const dest = 'public/media/logo.png';

https.get(url, (res) => {
  res.pipe(fs.createWriteStream(dest));
});
