import './config/env.js';

import app from './app.js';
import env from './config/env.js';

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/`);
});
