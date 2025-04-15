import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigServise implements IConfigService {
    private config: DotenvParseOutput;


    constructor() {
        const { error, parsed } = config();

        if (error) {
            throw new Error("Не найден файл .env");
        }

        if (!parsed) {
            throw new Error("Файл .env пустой");
        }

        this.config = parsed;
    }

    get(key: string): string {
        const res = this.config[key];

        if(!res){
            throw Error("Нет такого ключа");
        }

        return res;
    }
}