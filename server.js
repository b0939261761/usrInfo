import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.static('public'));

app.use(express.json());
app.use('/', routes);

app.use((err, req, res, next) => {
  const errors = err instanceof Array
    ? err.map(el => ({ stack: el.stack, ...el }))
    : { stack: err.stack, ...err };
  res.status(422).json(errors);
});

app.listen(port, () => console.info(`💡 App listening on port ${port}!`));
