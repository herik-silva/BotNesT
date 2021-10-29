import {create} from "@open-wa/wa-automate";
import Bot from "./Entity/Bot";

// import Page from "./Interactor/Page";

const bot = new Bot();
create({headless: true, executablePath: process.env.CHROME_PATH, chromiumArgs: ['--no-sandbox','--ignore-google-port-numbers', '--disable-setuid-sandbox']}).then(client => bot.ouvirMensagens(client));