import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 8888;

app.use(cors());

app.use(express.static(path.resolve(__dirname, './public/website/browser')));
app.use('/data', express.static(path.resolve(__dirname, './public/data')));

app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, './public/website/browser/index.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});