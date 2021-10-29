class ToDo {
    private text: string;
    private checked: boolean;
    
    constructor(text: string, checked: boolean){
        this.text = text;
        this.checked = checked;
    }

    getText(): string {
        return this.text;
    }

    hasChecked(): boolean {
        return this.checked;
    }
}

export default ToDo;