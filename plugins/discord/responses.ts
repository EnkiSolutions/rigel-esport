import { InputText, InteractionResponseType } from "discord-interactions";
import { InteractionResponse, ModalComponent, ResponseMessage } from "./types";
import { getInputText } from "./components";

function sendResponse<T>(type: InteractionResponseType, data: T)
    : { status?: number, body: InteractionResponse<T> }
{
    return { status: 200, body: { type, data } }
}

export function sendError(error: string, status: number = 400) {
    console.error(error)
    return { status, body: { error } }
}

export function sendMessage(data: ResponseMessage) {
    return sendResponse(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data
    );
}

export function sendModal(
    custom_id: string,
    title: string,
    ...components: (Omit<InputText, "type">)[])
{
    return sendResponse(
        InteractionResponseType.MODAL,
        { 
            custom_id,
            title,
            components: components
                .map(v => getInputText(v))
        }
    );
}

export function getModalKV(components: ModalComponent[]) {
    return components.reduce((r, { components }) => {
        r[components[0].custom_id] = components[0].value
        return r;
    }, {});
}