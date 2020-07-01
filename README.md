# 银行存款预测

## 前提
基于ModelArts预测分析生成在线服务，此处代码部分为应用实现。
**请务必替换API地址和AK、CK**
.env:
```
AK=*****您的AK*******
CK=********您的CK**************
```

运行：    
```bash
npm install
npm start
```

## 准备    

还是那句老话，“磨刀不误砍柴工”，“工欲善其事必先利其器”，“巧妇难为无米之炊”，好像我有只记得这几句。OBS、ModelArts、全局访问密钥等等先准备一下，这里就不提具体的细节了，关注过我的朋友应该很熟悉了，默认大家已经开通OBS并新建了桶，同时开通ModelArts。

- 数据集下载     

点击下载训练数据集[train.csv](https://cdn.jsdelivr.net/gh/huaweicloud/ModelArts-Lab/ExeML/ExeML_Bank_Deposit_Prediction/data/train.crv)[1]

银行客户数据集的字段解释如下：

| 字段名 | 含义     | 类型   | 描述                     |
| ------ | -------- | ------ | ------------------------ |
| attr_1 | 年龄     | Int    | 表征客户的年龄           |
| attr_2 | 职业     | String | 表征客户所从事的职业     |
| attr_3 | 婚姻情况 | String | 表征客户是否结婚或已离异 |
| attr_4 | 教育情况 | String | 表征客户受教育的程度     |
| attr_5 | 房产情况 | String | 表征客户名下是否有房产   |
| attr_6 | 贷款情况 | String | 表征客户名下是否有贷款   |
| attr_7 | 存款情况 | String | 表征客户名下是否有存款   |
![data-view.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/2338471g1zrd0y3wlax1vv.png)


- 上传数据集到OBS    

上传银行数据集文件至OBS（OBS操作指导参考：https://support.huaweicloud.com/qs-obs/obs_qs_0001.html ），本案例上传至OBS路径“/ai-camp/automl/bank/train.csv”。
![data-obs.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234316dcaenj4dtoqxts7y.png)


## 实践

- 新建预测分析项目    

进入[ModelArts 自动学习](https://console.huaweicloud.com/modelarts/?region=cn-north-4#/exeml)[2],选择【预测分析】创建项目，本次实践命名为**exeML-bank-predict**，数据集选择上一步上传的train.csv，点击【创建项目】即可新建一个预测分析类型的自动学习项目。
![createML.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234332dgmebhocepvk1u4m.png)


- 数据标注    
成功创建完项目，会自动进入【数据标注】界面，如果不小心关闭了，可在【自动学习】界面找到刚刚创建的**exeML-bank-predict**项目，点击项目名称**exeML-bank-predict**仍可进入到【数据标注】界面，我们这里根据业务需求，标签列选择“attr_7”（是否会办理存款），标签列数据类型选择“离散值”，点击【训练】，开始训练。如有弹窗点击确认即可。
![data-mark.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/2343550mlj3t1iy6r06ge8.png)


- 模型训练     

在【模型训练】界面等待训练完成（预计5分钟，我等了10分钟），训练完成后，可以查看模型的精度，当然如果不小心关闭页面了，同样在【自动学习】界面找到当前项目并点击顶部【模型训练】再次进入到【模型训练】页面查看训练状态、版本信息等。
![data-train.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234418zkqqqmv6we1upn9n.png)


- 部署上线   
当训练成功完成之后，之前【停止】的按钮会变成【部署】,点击即可进入部署流程，等待部署成功即可进行服务测试。
![data-server.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234440uemsrjfhhbwqvz13.png)


- 服务测试
在【部署上线】界面，等待服务部署成功（PS：耐心等待中……）。添加一条银行客户信息，然后点击【预测】，即可完成测试。
银行客户信息：

```json
{
  &quot;meta&quot;: {
    &quot;uuid&quot;: &quot;10eb0091-887f-4839-9929-cbc884f1e20e&quot;
  },
  &quot;data&quot;: {
    &quot;count&quot;: 1,
    &quot;req_data&quot;: [
      {
        &quot;attr_1&quot;: &quot;58&quot;,
        &quot;attr_2&quot;: &quot;management&quot;,
        &quot;attr_3&quot;: &quot;married&quot;,
        &quot;attr_4&quot;: &quot;tertiary&quot;,
        &quot;attr_5&quot;: &quot;yes&quot;,
        &quot;attr_6&quot;: &quot;no&quot;,
        &quot;attr_7&quot;: &quot;no&quot;
      }
    ]
  }
}
```
![data-testresult.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234517yot7q4mlseennzph.png)


## 应用
虽然整个实践很简单，在实践之后，我也思考了一下，从实践本身来说，我们可以落地的应用就是基于客户特征判断是否有存款的需求。于是，我们根据已有的数据挖掘了新的特征。按照服务测试时的请求数据格式，我们是可以一次请求实现多条数据预测的，那么对于大量数据来说，就可以批量进行预测了。当然，ModelArts自动学习的预测分析还可以做很多很多不同场景的应用。最后，既然完成了服务端的实践，那客户端的形态可以是千千万万种，意味着我们的应用也是可以不同的，我这里已一个简单的表单提交完成客户端的实践，【今天你存款了吗？】终于得以完成！说实话，自动学习模型部署从无到有只需一会儿，而我开发这个简单的表单应用却花了一天，主要还是服务端调用ModelArts在线服务那卡壳了。最终采用NodeJS框架[koajs](https://github.com/koajs/koa)[3]进行开发，表单页面使用VueJS粗暴的堆了组件，什么VantUI、Axios等等。详细代码见[Bank_Deposit_Predictio](https://github.com/hu-qi/Bank_Deposit_Prediction)[4]，欢迎star和拍砖指正！
![myserver.png](https://bbs-img-cbc-cn.obs.cn-north-1.myhuaweicloud.com/data/attachment/forum/202007/01/234531a6zhpt39qwajby8v.png)


## 核心代码
此处使用NodeJS调用ModelArts在线服务，可参考华为云提供的[API签名指南](https://support.huaweicloud.com/devg-apisign/api-sign-provide.html)[45。我这里采用的KoaJS，其他实现方案类似。首先新建.env文件存放AK/SK，通过**dotenv**库读取；然后借助**signer**配置签名；最后简单封装了api调用，只需在调用的时候传入数据和请求地址就可以获取预测结果，当然目前没有做文件上传预测的功能，后续一起研究研究。
```javascript
// dotenv读取.env配置文件
const dotenv = require(&quot;dotenv&quot;);
// http组件
const koaRequest = require(&quot;koa2-request&quot;);
// 官方提供的签名工具
const signer = require(&quot;./signer&quot;);

// 默认api地址
const URL =
  &quot;https://3b3d112b50be48a29350819fb3f576dc.apig.cn-north-4.huaweicloudapis.com/v1/infers/cd97ab64-3081-4f09-8cfd-6a615239990e&quot;;

// 默认请求参数
const BODY = `
{
    &quot;meta&quot;: {
      &quot;uuid&quot;: &quot;10eb0091-887f-4839-9929-cbc884f1e20e&quot;
    },
    &quot;data&quot;: {
      &quot;count&quot;: 1,
      &quot;req_data&quot;: [
        {
          &quot;attr_1&quot;: &quot;58&quot;,
          &quot;attr_2&quot;: &quot;management&quot;,
          &quot;attr_3&quot;: &quot;married&quot;,
          &quot;attr_4&quot;: &quot;tertiary&quot;,
          &quot;attr_5&quot;: &quot;yes&quot;,
          &quot;attr_6&quot;: &quot;no&quot;,
          &quot;attr_7&quot;: &quot;no&quot;
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
const submit = async function (body, url) {
  const r = new signer.HttpRequest(&quot;POST&quot;, url || URL);
  r.body = body || BODY;
  r.headers = { &quot;Content-Type&quot;: &quot;application/json&quot; };

  const opt = sig.Sign(r);

  //koa封装的请求第三方接口的方法(koa2-request)
  let res = await koaRequest(Object.assign(opt, { body: r.body }));
  return res.body;
};

module.exports = submit;
```

入口调用及返回前端页面：
```javascript
const fs = require(&quot;fs&quot;);
const Koa = require(&quot;koa&quot;);
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const submit = require('./submit')
app.use(bodyParser());

const main = async (ctx) =&gt; {
  if (ctx.request.path == &quot;/&quot;) {
    ctx.response.type = &quot;html&quot;;
    ctx.response.body = fs.createReadStream(&quot;./bank.html&quot;);
  } else if (ctx.request.path == &quot;/submit&quot;) {
    console.log(ctx.request.body)
    ctx.response.type = 'json';
    ctx.response.body = await submit(JSON.stringify(ctx.request.body)||'');
    console.log(ctx.response.body)
  }
  else {
    ctx.response.body = &quot;Hello World&quot;;
  }
};

app.use(main);
app.listen(3000);

```
就这么几行代码，琢磨了一天，看来还是无法摆脱Copy攻城狮的魔咒啊！

## 参考链接
[1] https://cdn.jsdelivr.net/gh/huaweicloud/ModelArts-Lab/ExeML/ExeML_Bank_Deposit_Prediction/data/train.crv
[2] https://console.huaweicloud.com/modelarts/?region=cn-north-4#/exeml
[3] https://github.com/koajs/koa
[4] https://github.com/hu-qi/Bank_Deposit_Prediction
[5] https://support.huaweicloud.com/devg-apisign/api-sign-provide.html
