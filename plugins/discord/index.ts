import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import { InteractionObject } from "./types";
import { sendError } from "./responses";

export default async function (
    message: InteractionObject,
    signature: string,
    timestamp: string,
    publicKey: string): Promise<{ status?: number, body: {} }> {
    const isValidRequest = verifyKey(
        JSON.stringify(message),
        signature,
        timestamp,
        publicKey
    );

    if (!isValidRequest)
        return sendError("Bad request signature", 401);

    switch (message.type) {
        // Handle PINGs from Discord
        case InteractionType.PING:
            console.log("Handling Ping request");
            return { body: { type: InteractionResponseType.PONG } };
        default: return sendError("Unknown Type");
    }
}