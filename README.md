# 球馆官网

这是一个可以直接部署到 GitHub Pages 的静态球馆官网。

## 文件说明

- `index.html`：网站内容，包括球馆名称、介绍、价格、营业时间和联系方式。
- `styles.css`：网站样式。
- `assets/court-hero.png`：首页大图。

## 需要替换的内容

打开 `index.html`，搜索并替换这些占位内容：

- `星河球馆`：换成你的球馆名称。
- `138 0000 0000` 和 `13800000000`：换成你的预约电话。
- `your-wechat-id`：换成你的微信号或公众号名称。
- `这里填写你的球馆详细地址`：换成真实地址。
- 价格、营业时间、课程介绍：按你的实际情况修改。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，比如 `court-website`。
2. 上传本文件夹里的全部内容，不要只上传 `index.html`。
3. 进入仓库的 `Settings`。
4. 左侧点击 `Pages`。
5. `Source` 选择 `Deploy from a branch`。
6. `Branch` 选择 `main`，文件夹选择 `/root`。
7. 保存后等待 1 到 3 分钟。

网站地址一般是：

```text
https://你的用户名.github.io/court-website/
```
