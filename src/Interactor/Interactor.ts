import { Client } from "@notionhq/client/build/src";

interface Interactor {
    getConnection(): Client;
    consultData(...args): Promise<any>
}

export default Interactor;