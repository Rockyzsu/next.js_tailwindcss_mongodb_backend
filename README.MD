1. 使用前后端框架next.js, 客户端渲染，API由服务端提供

2. 后端API返回查询数据，有mongodb查询数据返回。
i. db.getCollection('recommend_list').find({'status':'completed'}).count();
返回下载好的短剧数量

ii. 未下载好的数量
db.getCollection('recommend_list').find({"status": {"$ne": "completed"}})


3. 前端页面加载网页时，调用这几个API，显示2个数据，外加一个全部短剧数量

4. .env 文件保存mongodb数据库信息
