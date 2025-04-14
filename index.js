const TelegramAPI = require('node-telegram-bot-api');

const {gameOptions, againOptions} = require("./options.js");
const token = '7868245296:AAEd9HJv9maO1vY2xOq82ROZYFAynuKBUs0';
const bot = new TelegramAPI(token, { polling: true })
const chats = {};



const start = () => {
    bot.setMyCommands([
        { command: '/start', description: "Приветствие" },
        { command: '/info', description: "Базовая информация" },
        { command: '/game', description: `Игра ${"Угадай число"}` },
    ])

    bot.on('message', async (msg) => {
        const firstName = msg.chat.first_name;
        const text = msg.text;
        const chatID = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatID, 'https://avatars.mds.yandex.net/i?id=de5bd7afdbbf4abefdf45ffdd5b64fb28779be84-5257789-images-thumbs&n=13')

            return bot.sendMessage(chatID, `Здравствуйте, ${firstName}!`);
        } if (text === "/info") {
            return bot.sendMessage(chatID, `Вся доступная информация про вас ${msg.chat.username}`);
        } if (text == '/game') {
            return startGame(chatID);
        } if (text === '/again') {
            return startGame(chatID);
        } 

        console.log(msg);

        return bot.sendMessage(chatID, `Вы написали: ${text}`);
    })


    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatID = msg.message.chat.id;

        if(data === '/again'){            
            return startGame(chatID);
        }

        if(data === "/exit")
            return bot.sendMessage(chatID, "Принято, спасибо за игру!")

        if (Number(data) === chats[chatID]) {
            return await bot.sendMessage(chatID, `Поздравляю, ты отгадал цифру  ${chats[chatID]}`, againOptions)
        } else {
            return await bot.sendMessage(chatID, `К сожалению ты не отгадал цифру, загаданная: ${chats[chatID]}`, againOptions)
        }
    })

    console.log("Приложение запущено");
}


const startGame = async (parChatID) => {
    await bot.sendMessage(parChatID, "Сейчас я загадалю цифру от 0 до 9, а ты попробуй отгадать");
    const randomNumber = Math.floor(Math.random() * 10);

    chats[parChatID] = randomNumber;
    await bot.sendMessage(parChatID, "Отгадывай", gameOptions);
}

start();