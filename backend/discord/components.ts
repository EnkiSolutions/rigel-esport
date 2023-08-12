import { ActionRow, InputText, MessageComponentTypes } from "discord-interactions";

export function getInputText(data: Omit<InputText, 'type'>): ActionRow & { components: InputText[] } {
    return {
        type: MessageComponentTypes.ACTION_ROW,
        components: [{
            type: MessageComponentTypes.INPUT_TEXT,
            ...data
        }]
    }
}