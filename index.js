const fs = require("fs");
const Koa = require("koa");
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const submit = require('./submit')
app.use(bodyParser());

const main = async (ctx) => {
  if (ctx.request.path == "/") {
    ctx.response.type = "html";
    ctx.response.body = fs.createReadStream("./bank.html");
  } else if (ctx.request.path == "/submit") {
    console.log(ctx.request.body)
    ctx.response.type = 'json';
    ctx.response.body = await submit(JSON.stringify(ctx.request.body)||'');
    console.log(ctx.response.body)
  }
  else {
    ctx.response.body = "Hello World";
  }
};

app.use(main);
app.listen(3000);
console.log("http://localhost:3000")
