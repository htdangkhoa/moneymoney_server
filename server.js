require("dotenv").config();
require("./app/variables");
require("./app/models/user");
require("./app/models/card");
require("./app/models/record");
require("./app/models/note");
require("./app/passport/passport");
require("./app/middlewares");

var localtunnel = require("localtunnel");

let app = global.variables.app,
    cluster = require("cluster")
    numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    console.log("Server is running on port:", process.env.PORT);
    console.log("Master " + process.pid + " is running");

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);

        cluster.fork();
    });
}else {
    var options = {
        subdomain: "moneymoney",
        local_host: "localhost",
    }

    var tunnel = localtunnel(process.env.PORT, options, (err, tunnel) => {
        if (err) console.log(err);
    
        console.log(tunnel.url)
    });
    tunnel.on("close", () => {
        console.log("Tunnel are closed.")
    });
    
    app.listen(process.env.PORT, () => {
        console.log("Worker " + process.pid + " started");
    });
}