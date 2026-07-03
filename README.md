# 幸福管家高保真可点击网页原型

## 打开方式

推荐本地服务方式：

```powershell
cd D:\Product\BLS\happybutler\prototype
npm run dev -- --port 4173
```

浏览器打开：

```text
http://127.0.0.1:4173/
```

## 演示路径

1. 居民端：首页 → 一键诉求 / 随便问小福 → 转为诉求草稿 → 提交诉求。
2. 后台管理：切换“后台管理” → 诉求管理 → 处理最新工单 → 派单给党员 → 标记完成。
3. 居民端：回到居民端 → 消息/进度 → 去评价。

## 已覆盖页面

- 居民端：首页、一键诉求、进度查询、服务事项、个人中心。
- 后台管理：数据概览、诉求管理、党员管理、服务事项、政策管理、公告管理、用户管理、AI知识库。

## 验证

```powershell
node D:\Product\BLS\happybutler\prototype\prototype-smoke-test.js
npm run build
```
