require('dotenv').config();
require('./app/variables');
require('./app/models/user');
require('./app/models/card');
require('./app/models/record');
require('./app/models/note');
require('./app/models/history');
require('./app/passport/passport');
require('./app/middlewares');

let app = global.variables.app,
  cluster = require('cluster');
numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('Server is running on port:', process.env.PORT);
  console.log('Master ' + process.pid + ' is running');

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'worker %d died (%s). restarting...',
      worker.process.pid,
      signal || code
    );

    cluster.fork();
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log('Worker ' + process.pid + ' started');
  });
}
