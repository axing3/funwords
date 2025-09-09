# FunWords - 高考趣味背单词

一个基于 Web 的离线单词学习应用，具有魂斗罗风格的 8 位像素美学。

## 特性

- 🎮 魂斗罗风格的游戏界面
- 📚 包含高中 3500 词汇
- 🎯 四种游戏模式：选择题、拼写题、听力题、混合模式
- 🏆 排行榜和成就系统
- 📱 PWA 支持，可离线使用
- 🎵 8 位复古音效
- 🌟 魂斗罗风格特效

## 游戏模式

1. **选择题模式** - 从 4 个选项中选择正确答案
2. **拼写模式** - 听发音拼写单词
3. **听力模式** - 听发音选择单词
4. **混合模式** - 随机切换以上三种模式

## 操作说明

- 使用鼠标点击选择答案
- 支持键盘快捷键（1-4 选择选项，Enter 确认）
- ESC 键关闭弹窗

## 技术栈

- 纯 HTML/CSS/JavaScript
- Web Audio API
- Service Worker
- LocalStorage

## 部署

已部署在 Vercel

## 本地运行

使用任何静态服务器：
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 访问 http://localhost:8000
```

## 项目结构

```
funwords/
├── index.html          # 主页面
├── game.html           # 游戏页面
├── practice.html       # 练习模式
├── settings.html       # 设置页面
├── results.html        # 成绩页面
├── sw.js               # Service Worker
├── manifest.json       # PWA 配置
├── vercel.json         # Vercel 配置
└── README.md           # 项目说明
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT
