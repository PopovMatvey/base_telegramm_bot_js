import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigServise } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/command.start";
import LocalSession from "telegraf-session-local";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configServise: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configServise.get("TELEGRAM_BOT_TOKEN"));
        this.bot.use(
            new LocalSession({ database: "session.json" }).middleware()
        );
    }

    init() {
        this.commands = [new StartCommand(this.bot)]
        
        for (const command of this.commands) {
            command.handle();
        }

        
        this.bot.launch();
        console.log("Бот запущен")
    }
}

const bot = new Bot(new ConfigServise());
bot.init();