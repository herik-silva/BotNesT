import Interactor from "./Interactor";
import { Client } from "@notionhq/client"
import ToDo from "../Entity/ToDo";

class Page implements Interactor{
    private blockId: string;
    private token: string;

    constructor(blockId: string, token: string){
        this.blockId = process.env.BLOCKID || blockId;
        this.token = process.env.TOKEN || token;
    }

    getConnection(): Client{
        return new Client({ auth: this.token });
    }

    async consultData(): Promise<Array<Array<ToDo>>> {
        const connection = this.getConnection();
        const weeks = [];

        const response = await connection.blocks.children.list({
            block_id: this.blockId
        });

        for(let result of response.results){
            if(result["toggle"]){
                const responseToDo = await connection.blocks.children.list({
                    block_id: result["id"]
                });
    
                const toDoList = [];
                for(let toDo of responseToDo.results){
                    const createdToDo = new ToDo(toDo['to_do'].text[0].plain_text,toDo['to_do'].checked)
                    toDoList.push(createdToDo);
                }
            
                weeks.push(toDoList);
            }
        }
        
        return weeks;
    }

}

export default Page;