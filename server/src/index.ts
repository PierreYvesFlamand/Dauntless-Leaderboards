import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 54321;

app.use(cors());
app.use('/data', express.static(path.resolve(__dirname, '../../data')))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});