const dotenv = require('dotenv');
dotenv.config();

const restapiServer = require('./controllers/rest_api');

restapiServer.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
