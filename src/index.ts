import {create} from "@open-wa/wa-automate";
import Bot from "./Entity/Bot";

// import Page from "./Interactor/Page";

const bot = new Bot();
create().then(client => bot.ouvirMensagens(client));