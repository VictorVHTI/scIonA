import * as restify from "restify";
import * as fs from "fs";
import send from "send";
import Agent from './services/agent';

//Create HTTP server.
const server = restify.createServer({
  key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,
  certificate: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
  formatters: {
    "text/html": (req, res, body) => {
      return body;
    },
  },
});

server.get(
  "/static/*",
  restify.plugins.serveStatic({
    directory: __dirname,
  })
);

server.use(restify.plugins.queryParser());

server.listen(process.env.port || process.env.PORT || 3333, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
});

// Adding tabs to our app. This will setup routes to various views
// Setup home page
server.get("/", (req, res, next) => {
  send(req, __dirname + "/views/index.html").pipe(res);
});

server.get("/js/chat-functionality.js", (req, res, next) => {
  send(req, __dirname + "/js/chat-functionality.js").pipe(res);
});

// Setup the static tab
server.get("/tab", (req, res, next) => {
  send(req, __dirname + "/views/index.html").pipe(res);
});

server.use(restify.plugins.bodyParser());

const agent = new Agent({ apiKey: "" });

server.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await agent.ask(question);
    res.send(200, { question: question, answer: response });
  } catch (error: any) {
    res.send(500, `An error occurred: ${error.message}`);
  }
});