# 国球精品刻乒乓培训官网

这是一个可以直接部署到 GitHub Pages 的静态官网，内容已根据 `rd.txt` 配置为国球精品刻乒乓培训。

## 文件说明

- `index.html`：网站内容，包括球馆名称、介绍、价格、营业时间和联系方式。
- `styles.css`：网站样式。
- `assets/hero.jpg`：首页大图。
- `assets/entrance.jpg`：门头图。
- `assets/interior.jpg`：室内场地图。
- `assets/logo-square.png`：当前官网顶部 Logo。
- `assets/logo.png`：原长方形 Logo，保留用于备选。

## 需要替换的内容

如需调整，打开 `index.html` 修改电话、微信、地址、价格、营业时间和课程介绍。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，比如 `court-website`。
2. 上传 `index.html`、`styles.css`、`README.md` 和整个 `assets` 文件夹。
3. 不需要上传 `rd.txt`，它只是本地配置文件，里面有你电脑上的图片路径。
4. 进入仓库的 `Settings`。
5. 左侧点击 `Pages`。
6. `Source` 选择 `Deploy from a branch`。
7. `Branch` 选择 `main`，文件夹选择 `/root`。
8. 保存后等待 1 到 3 分钟。

网站地址一般是：

```text
https://你的用户名.github.io/court-website/
```
