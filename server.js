require("dotenv").config();
require("./app/variables");
require("./app/models/user");
require("./app/passport/passport");
require("./app/middlewares");

let app = global.variables.app;

app.listen(process.env.PORT, () => {
    console.log("ok");
})