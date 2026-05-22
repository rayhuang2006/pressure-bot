const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;

// ====== 語錄模板庫 ======
const openers = [
  (topic) => `你要學${topic}嗎？`,
  (topic) => `${topic}你看過了嗎？`,
  (topic) => `欸 ${topic}要不要學一下？`,
  (topic) => `我覺得你可以學一下${topic}耶`,
  (topic) => `${topic}蠻重要的 你知道吧？`,
];

const followUps = [
  () => '學嗎？',
  () => '不學嗎？',
  () => '為什麼不學？',
  (_, skill) => `是不愛${skill}了嗎？`,
  (_, skill) => `不喜歡${skill}嗎？`,
  () => '所以你不想學？',
  () => '真的不學？',
];

const killers = [
  (_, __, usage) => `可是${usage}會用到誒`,
  (_, __, usage) => `但是${usage}需要這個啊`,
  (_, __, usage) => `${usage}沒有這個不行吧`,
  (_, __, usage) => `你${usage}的時候怎麼辦？`,
];

const closers = [
  () => '學嗎？',
  () => '不學嗎？',
  () => '所以...學嗎？',
  () => '嗯？',
  () => '你說啊',
];

// ====== 反駁系統 ======

// 否定詞要放前面，先比對長的
const flipTable = [
  { match: '不喜歡', reply: '喜歡啊' },
  { match: '不可以', reply: '可以啊' },
  { match: '不想要', reply: '想要啊' },
  { match: '不需要', reply: '需要啊' },
  { match: '不要', reply: '要啊' },
  { match: '不想', reply: '要想啊' },
  { match: '不會', reply: '會啊' },
  { match: '不好', reply: '好啊' },
  { match: '不是', reply: '就是' },
  { match: '不能', reply: '能啊' },
  { match: '沒有', reply: '有啊' },
  { match: '沒辦法', reply: '有辦法啊' },
  { match: '不用', reply: '要用啊' },
  { match: '喜歡', reply: '不喜歡' },
  { match: '可以', reply: '不可以' },
  { match: '想要', reply: '不要' },
  { match: '需要', reply: '不需要' },
  { match: '要', reply: '不要' },
  { match: '想', reply: '不想' },
  { match: '會', reply: '不會' },
  { match: '好', reply: '不好' },
  { match: '是', reply: '不是' },
  { match: '能', reply: '不能' },
  { match: '有', reply: '沒有' },
  { match: '對', reply: '不對' },
];

const fallbackReplies = [
  '才不是',
  '不要',
  '並沒有',
  '你確定？',
  '我不覺得',
  '反對',
  '不是這樣吧',
  '怎麼會',
  '想太多',
];

// 存正在被反駁的人 { odjectId: { channelId, expiresAt } }
const contraTargets = new Map();

function generateContra(content) {
  for (const { match, reply } of flipTable) {
    if (content.includes(match)) {
      return reply;
    }
  }
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

// ====== 工具函數 ======
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generatePressure(topic, skill, usage) {
  const lines = [];
  lines.push(pickRandom(openers)(topic));

  const selected = pickRandomN(followUps, 2 + Math.floor(Math.random() * 2));
  for (const fn of selected) {
    lines.push(fn(topic, skill, usage));
  }

  lines.push(pickRandom(killers)(topic, skill, usage));
  lines.push(pickRandom(closers)());
  return lines;
}

// ====== Bot 主體 ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`已上線：${client.user.tag}`);
});

// ====== Slash Commands ======
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /壓榨
  if (interaction.commandName === '壓榨') {
    const topic = interaction.options.getString('主題');
    const skill = interaction.options.getString('技能') || '寫程式';
    const usage = interaction.options.getString('用途') || '專案';
    const target = interaction.options.getUser('對象');

    const lines = generatePressure(topic, skill, usage);

    const firstLine = target ? `${target} 你聽好：\n${lines[0]}` : lines[0];
    await interaction.reply({ content: firstLine });

    for (let i = 1; i < lines.length; i++) {
      await sleep(800 + Math.random() * 1200);
      await interaction.channel.send(lines[i]);
    }
  }

  // /反駁模式
  if (interaction.commandName === '反駁模式') {
    const target = interaction.options.getUser('對象');
    const minutes = interaction.options.getInteger('時間') || 3;

    if (target.id === client.user.id) {
      await interaction.reply({ content: '我不會反駁我自己啦' });
      return;
    }

    const expiresAt = Date.now() + minutes * 60 * 1000;
    contraTargets.set(target.id, {
      channelId: interaction.channelId,
      expiresAt,
    });

    await interaction.reply({
      content: `收到，接下來 ${minutes} 分鐘內我會反駁 ${target} 說的每一句話 😈`,
    });

    // 時間到自動移除
    setTimeout(() => {
      if (contraTargets.has(target.id)) {
        contraTargets.delete(target.id);
        interaction.channel.send(`${target} 的反駁時間結束了，暫時放過你`).catch(() => {});
      }
    }, minutes * 60 * 1000);
  }

  // /停止反駁
  if (interaction.commandName === '停止反駁') {
    const target = interaction.options.getUser('對象');

    if (contraTargets.has(target.id)) {
      contraTargets.delete(target.id);
      await interaction.reply({ content: `好吧，不反駁 ${target} 了` });
    } else {
      await interaction.reply({ content: `我本來就沒在反駁這個人啊` });
    }
  }
});

// ====== 自動反駁監聽 ======
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const target = contraTargets.get(message.author.id);
  if (!target) return;

  // 檢查是否過期
  if (Date.now() > target.expiresAt) {
    contraTargets.delete(message.author.id);
    return;
  }

  // 只在同一個頻道反駁
  if (message.channelId !== target.channelId) return;

  const reply = generateContra(message.content);

  await sleep(500 + Math.random() * 1000);
  await message.reply(reply);
});

client.login(TOKEN);
