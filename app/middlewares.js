let express = global.variables.express,
    app =  global.variables.app,
    morgan = global.variables.morgan,
    cors = global.variables.cors,
    bodyParser = global.variables.bodyParser,
    mongoose = global.variables.mongoose,
    passport = global.passport,
    cookieParser = global.variables.cookieParser,
    session = global.variables.session,
    helmet = global.variables.helmet,
    compression = global.variables.compression,
    mongo_express = require("mongo-express/lib/middleware"),
    ejs = require("ejs");

mongoose.connect(process.env.DB_URI);

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  cookieName: "session",
  secret: "dAnGkho4*7896#",
  duration: 1000 * 60 * 60 * 24 * 365 * 999,
  // activeDuration: 5 * 60 * 1000,
}));
app.use(passport.initialize());
// app.use(passport.session());

app.use("/admin", mongo_express({
  mongodb: {
    connectionString: process.env.DB_URI,

    autoReconnect: true,
    poolSize: 4,
    admin: true,
    auth: [],

    adminUsername: "",
    adminPassword: "",
    whitelist: ["moneymoney"],
    blacklist: [],
  },

  site: {},

  useBasicAuth: true,
  basicAuth: {
    username: "admin",
    password: "admin"
  },

  options: {
    documentsPerPage: 10,
    editorTheme: "monokai",

    logger: { skip: () => true },
    readOnly: false,
  },

  defaultKeyNames: {},
}));

app.use("/", require("./routes/authentication"));
app.use("/v1", require("./routes/user"));
app.use("/v1", require("./routes/card"));
app.use("/v1", require("./routes/record"));
app.use("/v1", require("./routes/note"));

app.use((req, res) => {
  res.status(404).render("404");
})