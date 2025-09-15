const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: ['http://localhost:5500','http://127.0.0.1:5500','http://localhost:3000','http://127.0.0.1:3000'] }));
app.use(express.json());

app.use('/api', routes);
app.get('/api/health', (req,res)=>res.send('ok'));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`api-node listening on ${PORT}`));
