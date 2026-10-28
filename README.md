# Lyla老师 · TCF Canada Tâche 1 练习本

面向课堂学生的自我介绍背诵与考官提问听辨工具。

## 功能

- 上传老师确认的六模块 Word 文档，保留法语粗体关键词。
- 三档随机挖空、关键词复述、计时背诵与本地录音。
- 考官提问听辨、不同问法、示范回答及中文意思。
- 根据文档中的学习、工作及家庭信息筛选适用问题。

## 发布到 GitHub Pages

1. 在自己的 GitHub 账户创建公开仓库，建议名称 `lyla-tcf-t1`，默认分支为 `main`。
2. 将本项目内容提交到仓库根目录。必须包括 `.github/workflows/pages.yml`。
3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 打开 **Actions → Publish Lyla T1 practice site → Run workflow**。
5. 工作流成功后，在 **Settings → Pages** 查看正式网址。

以后向 `main` 提交修改，会自动检查并更新网站。不需要 API Key 或付费服务器。

## 在本地维护

使用 Node.js 22 或更新的兼容版本，无需安装 npm 依赖：

```sh
node scripts/test-question-relevance.mjs
npm run build
python3 -m http.server 8080 --directory dist
```

打开 `http://localhost:8080`。请通过 HTTP/HTTPS 运行，不要双击 HTML 文件。

## 学生数据与迁移

上传的材料和练习记录保存在当前网址下的浏览器本地存储中，不会提交到 GitHub。换网址或换浏览器后，学生需要重新上传 Word。录音需要学生自行下载保存。

法语播放依赖设备的法语语音；文档原句的自动中文翻译依赖浏览器是否支持本地 Translator API。预设通用示范已配有中文。

## 内容与依赖

教学内容由 Lyla老师独立开发。公开仓库用于备份和部署，不自动授予教学内容的转载、分发或商业使用许可。

第三方 JSZip 的许可见 `src/vendor/JSZIP-LICENSE.md`。

本迁移包不包含原托管平台的账户配置、Git 历史、密钥或学生上传的文件。
