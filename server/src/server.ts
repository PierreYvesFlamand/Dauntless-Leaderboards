import express from 'express';
import cors from 'cors';
import path from 'path';
import config from '../config';

const app: express.Express = express();
const port: number = config.EXPRESS_PORT;

app.use(cors());

// Expose client
app.use(express.static(path.resolve(__dirname, '../../client/dist/browser')));

// Expose file database
app.use('/data', express.static(path.resolve(__dirname, '../../database/exposed')));

// Force redirection for the Angular one page app to work
app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist/browser/index.html'));
});

app.listen(port, () => {
    console.log(`✅ Server ready and listening on port ${port}`);
});