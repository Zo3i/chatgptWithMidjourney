<div align="center">
<img src="./docs/images/icon.svg" alt="预览"/>

<h1 align="center">ChatGPT Next Web</h1>

一键免费部署你的私人 ChatGPT 网页应用。

[演示 Demo](https://chat-gpt-next-web.vercel.app/) / [反馈 Issues](https://github.com/Yidadaa/ChatGPT-Next-Web/issues) / [加入 Discord](https://discord.gg/zrhvHCr79N) / [QQ 群](https://user-images.githubusercontent.com/16968934/228190818-7dd00845-e9b9-4363-97e5-44c507ac76da.jpeg) / [打赏开发者](https://user-images.githubusercontent.com/16968934/227772541-5bcd52d8-61b7-488c-a203-0330d8006e2b.jpg) / [Donate](#捐赠-donate-usdt)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zo3i/chatgptWithMidjourney&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Zo3i/chatgptWithMidjourney)

![主界面](./docs/images/cover.png)

</div>

## 开始使用

1. 准备好你的 [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. 点击右侧按钮开始部署：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zo3i/chatgptWithMidjourney&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)
，直接使用 Github 账号登录即可，记得在环境变量页填入 API Key 和[页面访问密码](#配置页面访问密码) CODE；
3. 部署完毕后，即可开始使用；
4. （可选）[绑定自定义域名](https://vercel.com/docs/concepts/projects/domains/add-a-domain)：Vercel 分配的域名 DNS 在某些区域被污染了，绑定自定义域名即可直连。

### 如何使用Midjourney
- 在.env.local(没有要创建)中添加MIDJOURNEY_API_KEY、MIDJOURNEY_API_URL。接口地址和key
  ```local
   示例:
   OPENAI_API_KEY=sk-xxx
   MIDJOURNEY_API_KEY=35fc0377-ca20-4244-8e44-7a930b7591ab
   MIDJOURNEY_API_URL=https://api.zxx.im/
   ```
- 输入/mj 即可使用绘图模式
- 绘图期间请勿刷新网页、切换别的聊天窗口。
- [MidjourneyAPI](https://midjourneyapi.zxx.im/)

![](https://s3.bmp.ovh/imgs/2023/05/15/f0c7f67ef3eb075b.png)

## 保持更新

如果你按照上述步骤一键部署了自己的项目，可能会发现总是提示“存在更新”的问题，这是由于 Vercel 会默认为你创建一个新项目而不是 fork 本项目，这会导致无法正确地检测更新。
推荐你按照下列步骤重新部署：

- 删除掉原先的仓库；
- 使用页面右上角的 fork 按钮，fork 本项目；
- 在 Vercel 重新选择并部署，[请查看详细教程](./docs/vercel-cn.md#如何新建项目)。

### 打开自动更新

> 如果你遇到了 Upstream Sync 执行错误，请手动 Sync Fork 一次！

当你 fork 项目之后，由于 Github 的限制，需要手动去你 fork 后的项目的 Actions 页面启用 Workflows，并启用 Upstream Sync Action，启用之后即可开启每小时定时自动更新：

![自动更新](./docs/images/enable-actions.jpg)

![启用自动更新](./docs/images/enable-actions-sync.jpg)

### 手动更新代码

如果你想让手动立即更新，可以查看 [Github 的文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) 了解如何让 fork 的项目与上游代码同步。

你可以 star/watch 本项目或者 follow 作者来及时获得新功能更新通知。

## 配置页面访问密码

> 配置密码后，用户需要在设置页手动填写访问码才可以正常聊天，否则会通过消息提示未授权状态。

> **警告**：请务必将密码的位数设置得足够长，最好 7 位以上，否则[会被爆破](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/518)。

本项目提供有限的权限控制功能，请在 Vercel 项目控制面板的环境变量页增加名为 `CODE` 的环境变量，值为用英文逗号分隔的自定义密码：

```
code1,code2,code3
```

增加或修改该环境变量后，请**重新部署**项目使改动生效。

## 环境变量

> 本项目大多数配置项都通过环境变量来设置，教程：[如何修改 Vercel 环境变量](./docs/vercel-cn.md)。

### `OPENAI_API_KEY` （必填项）

OpanAI 密钥，你在 openai 账户页面申请的 api key。

### `CODE` （可选）

访问密码，可选，可以使用逗号隔开多个密码。

**警告**：如果不填写此项，则任何人都可以直接使用你部署后的网站，可能会导致你的 token 被急速消耗完毕，建议填写此选项。

### `BASE_URL` （可选）

> Default: `https://api.openai.com`

> Examples: `http://your-openai-proxy.com`

OpenAI 接口代理 URL，如果你手动配置了 openai 接口代理，请填写此选项。

> 如果遇到 ssl 证书问题，请将 `BASE_URL` 的协议设置为 http。

### `OPENAI_ORG_ID` （可选）

指定 OpenAI 中的组织 ID。

### `HIDE_USER_API_KEY` （可选）

如果你不想让用户自行填入 API Key，将此环境变量设置为 1 即可。

### `DISABLE_GPT4` （可选）

如果你不想让用户使用 GPT-4，将此环境变量设置为 1 即可。

## 开发

> 强烈不建议在本地进行开发或者部署，由于一些技术原因，很难在本地配置好 OpenAI API 代理，除非你能保证可以直连 OpenAI 服务器。

点击下方按钮，开始二次开发：

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Zo3i/chatgptWithMidjourney)

在开始写代码之前，需要在项目根目录新建一个 `.env.local` 文件，里面填入环境变量：

```
OPENAI_API_KEY=<your api key here>
```

### 本地开发

1. 安装 nodejs 18 和 yarn，具体细节请询问 ChatGPT；
2. 执行 `yarn install && yarn dev` 即可。⚠️ 注意：此命令仅用于本地开发，不要用于部署！
3. 如果你想本地部署，请使用 `yarn install && yarn start` 命令，你可以配合 pm2 来守护进程，防止被杀死，详情询问 ChatGPT。

## 部署

### 容器部署 （推荐）

> Docker 版本需要在 20 及其以上，否则会提示找不到镜像。

> ⚠️ 注意：docker 版本在大多数时间都会落后最新的版本 1 到 2 天，所以部署后会持续出现“存在更新”的提示，属于正常现象。

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="页面访问密码" \
   yidadaa/chatgpt-next-web
```

你也可以指定 proxy：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="页面访问密码" \
   --net=host \
   -e PROXY_URL="http://127.0.0.1:7890" \
   yidadaa/chatgpt-next-web
```

如果你需要指定其他环境变量，请自行在上述命令中增加 `-e 环境变量=环境变量值` 来指定。

### 本地部署

在控制台运行下方命令：

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

⚠️ 注意：如果你安装过程中遇到了问题，请使用 docker 部署。

## 鸣谢

### 捐赠者

> 见英文版。

### 贡献者

[见项目贡献者列表](https://github.com/Yidadaa/ChatGPT-Next-Web/graphs/contributors)

## 开源协议

> 反对 996，从我开始。

[Anti 996 License](https://github.com/kattgu7/Anti-996-License/blob/master/LICENSE_CN_EN)
