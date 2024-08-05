require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

const userStates = {};

const startKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👨‍💼 Xodim kerak" }, { text: "👨‍💻 Ish joyi kerak" }],
            [{ text: "🧑‍🏫 Ustoz kerak" }]
        ],
        resize_keyboard: true
    }
};

const removeKeyboard = {
    reply_markup: {
        remove_keyboard: true
    }
};

const STATES = {
    JOB_REQUEST: {
        COMPANY_NAME: 'COMPANY_NAME',
        CONTACT_NAME: 'CONTACT_NAME',
        CONTACT_USERNAME: 'CONTACT_USERNAME',
        LIBRARIES: 'LIBRARIES',
        LOCATION: 'LOCATION',
        WORKING_HOURS: 'WORKING_HOURS',
        SALARY: 'SALARY',
        ADDITIONAL_COMMENT: 'ADDITIONAL_COMMENT',
    },
    JOB_SEEKER: {
        FULL_NAME: 'FULL_NAME',
        LIBRARIES: 'LIBRARIES',
        EXPERIENCE: 'EXPERIENCE',
        USERNAME: 'USERNAME',
        SALARY: 'SALARY',
        AIM: 'AIM',
    },
    MENTOR_REQUEST: {
        FULL_NAME: 'FULL_NAME',
        LIBRARIES: 'LIBRARIES',
        EXPERIENCE: 'EXPERIENCE',
        AIM: 'AIM',
    },
};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🖐 Assalomu alaykum! Bu botda siz o'z e'loningizni mutlaqo tekinga qo'yishingiz mumkin va sizning e'loningiz shu kanalda e'lon qilinadi: https://t.me/python_jobs_online", startKeyboard);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "👨‍💼 Xodim kerak") {
        userStates[chatId] = { state: STATES.JOB_REQUEST.COMPANY_NAME, data: {} };
        bot.sendMessage(chatId, "🏢 Kompaniya nomini kiriting:", removeKeyboard);
    } else if (userStates[chatId] && userStates[chatId].state) {
        handleState(chatId, text);
    }
});

const handleState = (chatId, text) => {
    const userState = userStates[chatId];
    switch (userState.state) {
        case STATES.JOB_REQUEST.COMPANY_NAME:
            userState.data.company_name = text;
            userState.state = STATES.JOB_REQUEST.CONTACT_NAME;
            bot.sendMessage(chatId, "👤 Aloqa shaxsining to'liq ismini kiriting:");
            break;
        case STATES.JOB_REQUEST.CONTACT_NAME:
            userState.data.contact_name = text;
            userState.state = STATES.JOB_REQUEST.LIBRARIES;
            bot.sendMessage(chatId, "📚 Kutubxonalarni kiriting:");
            break;
        case STATES.JOB_REQUEST.LIBRARIES:
            userState.data.libraries = text;
            userState.state = STATES.JOB_REQUEST.CONTACT_USERNAME;
            bot.sendMessage(chatId, "📞 Kontaktni kiriting:");
            break;
        case STATES.JOB_REQUEST.CONTACT_USERNAME:
            userState.data.contact_username = text;
            userState.state = STATES.JOB_REQUEST.LOCATION;
            bot.sendMessage(chatId, "🌍 Hududni kiriting:");
            break;
        case STATES.JOB_REQUEST.LOCATION:
            userState.data.location = text;
            userState.state = STATES.JOB_REQUEST.WORKING_HOURS;
            bot.sendMessage(chatId, "🕒 Ish vaqti:");
            break;
        case STATES.JOB_REQUEST.WORKING_HOURS:
            userState.data.working_hours = text;
            userState.state = STATES.JOB_REQUEST.SALARY;
            bot.sendMessage(chatId, "💵 Maoshni kiriting:");
            break;
        case STATES.JOB_REQUEST.SALARY:
            userState.data.salary = text;
            userState.state = STATES.JOB_REQUEST.ADDITIONAL_COMMENT;
            bot.sendMessage(chatId, "ℹ️ Qo'shimcha izoh:");
            break;
        case STATES.JOB_REQUEST.ADDITIONAL_COMMENT:
            userState.data.additional_comment = text;
            sendJobRequestToChannel(chatId, userState.data);
            delete userStates[chatId];
            bot.sendMessage(chatId, "✅ E'loningiz muvaffaqiyatli yuborildi!", startKeyboard);
            break;
        default:
            break;
    }
};

const sendJobRequestToChannel = (chatId, data) => {
    const msg = `
<b>👨‍💼 Xodim kerak</b>

🏢 Kompaniya: ${data.company_name}
📚 Kutubxonalar: ${data.libraries}
👤 Ma'sul: ${data.contact_name}
📞 Kontakt: @${data.contact_username}
🌍 Hudud: ${data.location}
🕒 Ish vaqti: ${data.working_hours}
💵 Maosh: ${data.salary}
ℹ️ Qo'shimcha: ${data.additional_comment}

👉 @python_jobs_online
#xodim #${data.libraries} #${data.company_name}`;

    bot.sendMessage('@python_jobs_online', msg, { parse_mode: 'HTML' });
};

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    bot.setWebHook(`https://<pyjobsbot-d4qq>.vercel.app/bot${7260869261:AAHzihTN6zztZYEj_gfb4abdiMBTyc3vAXA}`);
});
