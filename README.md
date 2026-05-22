# Pressure Bot — 語錄產生器

> 「學嗎？」「不學嗎？」「為什麼不學？」「不喜歡寫程式嗎？」「可是高教會用到誒」「學嗎？」

你身邊有沒有那種人，明明只是「建議」你學個東西，但講完之後你覺得自己不學就會被開除？
這個 Bot 完美重現了那種 讓人不嘻嘻的壓榨

## 功能

在 Discord 輸入 `/壓榨`，Bot 會化身你的主管/學長/同事，一句一句對你進行靈魂拷問。

```
/壓榨 主題:Vue 技能:寫程式 用途:高教
/壓榨 主題:reverse_proxy 用途:機器 對象:@某個倒楣的人
```

每次產生的語錄都是隨機組合，**保證每次被壓榨的體驗都不一樣**。

## 語錄範例

```
欸 Vue要不要學一下？
不學嗎？
為什麼不學？
是不愛寫程式了嗎？
可是高教會用到誒
學嗎？
```

## 安裝

```bash
git clone git@github.com:rayhuang2006/pressure-bot.git
cd pressure-bot
npm install
```

建立 `.env`：

```
DISCORD_TOKEN=你的token
CLIENT_ID=你的client_id
```

註冊指令 & 啟動：

```bash
node deploy-commands.js
node bot.js
```

## 免責聲明

本 Bot 產生的所有語錄均為虛構。如有雷同，代表你的主管真的是這樣講話。
本專案不對任何因使用此 Bot 而導致的同事關係破裂、群組退出、已讀不回負責。

## 致謝

感謝 [@wulukewu](https://github.com/wulukewu) 提供的原始語料與靈感。沒有你的壓榨，就沒有這個專案。

## License

MIT — 你可以自由使用、修改、再壓榨。
