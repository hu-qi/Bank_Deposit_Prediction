// dotenv读取.env配置文件
const dotenv = require("dotenv");
// http组件
const koaRequest = require("koa2-request");
// 官方提供的签名工具
const signer = require("./signer");

// 默认api地址
const URL =
  "https://3b3d112b50be48a29350819fb3f576dc.apig.cn-north-4.huaweicloudapis.com/v1/infers/cd97ab64-3081-4f09-8cfd-6a615239990e";

// 默认请求参数
const BODY = `
{
    "meta": {
      "uuid": "10eb0091-887f-4839-9929-cbc884f1e20e"
    },
    "data": {
      "count": 1,
      "req_data": [
        {
          "attr_1": "58",
          "attr_2": "management",
          "attr_3": "married",
          "attr_4": "tertiary",
          "attr_5": "yes",
          "attr_6": "no",
          "attr_7": "no"
        }
      ]
    }
  }`

// 签名配置
dotenv.config();
const sig = new signer.Signer();
sig.Key = process.env.AK;
sig.Secret = process.env.CK;

// 简单封装api调用
const submit = async function (body, url=URL) {
  const r = new signer.HttpRequest("POST", url);
  r.body = body || BODY;
  r.headers = { "Content-Type": "application/json" };

  const opt = sig.Sign(r);

  //koa封装的请求第三方接口的方法(koa2-request)
  let res = await koaRequest(Object.assign(opt, { body: r.body, uri: URL }));
  return res.body;
};

module.exports = submit;
