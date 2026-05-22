const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('壓榨')
    .setDescription('產生一段吳春辰風格的壓力語錄')
    .addStringOption((option) =>
      option.setName('主題').setDescription('要壓榨的學習主題，例如：Vue、reverse proxy、高維').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('技能').setDescription('相關技能領域，例如：寫程式、數學（預設：寫程式）').setRequired(false)
    )
    .addStringOption((option) =>
      option.setName('用途').setDescription('會用到的場景，例如：高教、機器、專案（預設：專案）').setRequired(false)
    )
    .addUserOption((option) =>
      option.setName('對象').setDescription('要 @ 的對象（選填）').setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('反駁模式')
    .setDescription('開始自動反駁某個人說的每一句話')
    .addUserOption((option) =>
      option.setName('對象').setDescription('要反駁的對象').setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('時間').setDescription('反駁幾分鐘（預設 3 分鐘）').setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName('停止反駁')
    .setDescription('停止反駁某個人')
    .addUserOption((option) =>
      option.setName('對象').setDescription('要停止反駁的對象').setRequired(true)
    ),
].map((cmd) => cmd.toJSON());

const rest = new REST().setToken(TOKEN);

(async () => {
  try {
    console.log('正在註冊 Slash Commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Slash Commands 註冊成功！');
  } catch (error) {
    console.error('註冊失敗：', error);
  }
})();
