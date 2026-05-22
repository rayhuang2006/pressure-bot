const { Client, GatewayIntentBits } = require('discord.js');

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
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`已上線：${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== '壓榨') return;

  const topic = interaction.options.getString('主題');
  const skill = interaction.options.getString('技能') || '寫程式';
  const usage = interaction.options.getString('用途') || '專案';
  const target = interaction.options.getUser('對象');

  const lines = generatePressure(topic, skill, usage);

  // 第一句用 reply（Slash Command 必須 3 秒內回覆）
  const firstLine = target ? `${target} 你聽好：\n${lines[0]}` : lines[0];
  await interaction.reply({ content: firstLine });

  // 之後每一句單獨發，隨機延遲 0.8~2 秒
  for (let i = 1; i < lines.length; i++) {
    await sleep(800 + Math.random() * 1200);
    await interaction.channel.send(lines[i]);
  }
});

client.login(TOKEN);
require('dotenv').config();

