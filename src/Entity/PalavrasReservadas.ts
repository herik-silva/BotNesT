import { Client, Message, decryptMedia } from "@open-wa/wa-automate";
import fs from "fs";
import Page from "../Interactor/Page";
import resizeImg from "resize-img";


class PalavrasReservadas {
    private prefixo: string = "!";
    private comandoAjuda: string = "";

    constructor(){
        console.log(__dirname)
        const comandos = JSON.parse(fs.readFileSync(__dirname+"/../comandos.json",{encoding: "utf-8"}));
        console.log(comandos);
        // Carregando a lista de comandos para apresentação.
        for(const comando of comandos.comandos){
            this.comandoAjuda += `*${comando.nome}*\n${comando.descricao}\nComo usar: ${comando.exemplo}\n\n`
        }
    }

    getPrefixo(): string {
        return this.prefixo;
    }

    setPrefixo(novoPrefixo: string) {
        this.prefixo = novoPrefixo;
    }

    async AJUDA(client: Client, mensagem: Message, parametros: Array<string>): Promise<void> {
        await client.sendText(mensagem.from, this.comandoAjuda);
    }

    async CRONOGRAMA(client: Client, mensagem: Message, parametros: Array<string>): Promise<void> {
        await client.sendText(mensagem.from, "Buscando cronograma...");
        const page = new Page(process.env.BLOCK_ID,process.env.ACCESS_TOKEN);
        const toDoList = await page.consultData();

        const arrayMessage = ["*---CRONOGRAMA---*\n"];

        for(let index = 0; index<toDoList.length; index++){
            arrayMessage.push("\n*"+(index+1) + "° Semana*\n");
            for(let toDo of toDoList[index]){
                if(toDo.hasChecked()){
                    arrayMessage.push("[x] ~");
                    arrayMessage.push(toDo.getText() + "~\n");
                }
                else{
                    arrayMessage.push("[ ] ");
                    arrayMessage.push(toDo.getText() + "\n");
                }
            }
        }

        await client.sendText(mensagem.from, arrayMessage.join(""));
    }

    async STICKER(client: Client, mensagem: Message, parametros: Array<string>): Promise<void> {
        
        const mensagemSelecionada: Message = mensagem.quotedMsg || mensagem;

        if(mensagemSelecionada.type == "image"){
            await client.sendText(mensagem.from,"Aguarde um pouco, estou fazendo sua figurinha 😉");
            const imagem: Buffer = await decryptMedia(mensagemSelecionada);
            const imagemRedimensionada: Buffer = await resizeImg(imagem, { width: 550, height: 550});
    
            const imagemBase64: string = imagemRedimensionada.toString("base64");
            const imagemPreparada: string = `data:${mensagemSelecionada.mimetype};base64,${imagemBase64}`;
    
            await client.sendImageAsSticker(mensagem.from, imagemPreparada);
        }
    }

    async REUNIAO(client: Client, mensagem: Message, parametros: Array<string>): Promise<void> {
        const mensagemPreparada: string = `As reuniões com o orientador do grupo acontecem nas *Terças às 20:00* no link abaixo:\n ${process.env.MEET_LINK}`;

        await client.sendText(mensagem.from, mensagemPreparada);
    }
}

export default PalavrasReservadas;