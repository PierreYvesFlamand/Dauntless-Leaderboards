import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 80;

app.use(cors());

app.use('/', express.static(path.resolve(__dirname, './public/website')));
app.use('/data', express.static(path.resolve(__dirname, './public/data')));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});