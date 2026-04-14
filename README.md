# 基于Web前后端技术的福鼎白茶数字展示与交互服务系统

本仓库为项目的 GitHub Pages 展示版，采用纯静态资源部署，保留了福鼎白茶文化展示、茶品消费、论坛互动、茶园认购、用户中心和后台概览等主要页面，并通过浏览器本地存储模拟用户登录、收藏、购物车、订单、帖子、评论和认购记录等交互流程。

## 页面结构

- `index.html` 首页
- `culture.html` 文化展示
- `shop.html` 茶品消费
- `garden.html` 茶园认购
- `forum.html` 论坛社区
- `profile.html` 个人中心
- `login.html` 登录注册
- `admin.html` 后台概览

## 演示账号

- 管理员：`admin / admin123`
- 普通用户：`demo1 / 123456`

## 使用说明

本版本适合通过 GitHub Pages 在线展示。  
登录、收藏、购物车、订单、论坛互动和茶园认购等数据会保存到浏览器本地存储，不依赖后端服务。

## 部署方式

1. 创建 GitHub 仓库
2. 上传本目录中的全部文件
3. 在仓库 `Settings -> Pages` 中选择 `Deploy from a branch`
4. 选择 `main` 分支与 `/(root)` 目录
5. 保存后等待 GitHub Pages 生成访问地址
