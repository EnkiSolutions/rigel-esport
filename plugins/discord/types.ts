import { InteractionResponseType, InteractionType, MessageComponent, MessageComponentTypes } from "discord-interactions";

export type InteractionData = ApplicationData | MessageData | ModalData;

export type InteractionObject = {
	id: string;
	application_id: string;
	type: InteractionType;
	data?: InteractionData;
	guild_id?: string;
	channel?: unknown;
	channel_id?: string;
	member?: { user: unknown };
	user?: unknown;
	token: string;
	version: number;
	message?: unknown;
	app_permissions?: string;
	locale?: string;
	guild_locale?: string;
}

export type ApplicationOption = {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: ApplicationOption[];
	focused?: boolean;
}

export type ApplicationData = {
	id: string;
	name: string;
	type: number;
	resolved?: unknown;
	options?: ApplicationOption[];
	guild_id?: string;
	target_id?: string;
}

export type MessageData = {
	custom_id: string;
	component_type: MessageComponentTypes;
	values?: unknown[];
}

export type ModalComponent = { components: { custom_id: string, value: string }[] };

export type ModalData = {
	custom_id: string;
	components: ModalComponent[];
}

export type ResponseMessage = {
	tts?: boolean;
	content?: string;
	embeds?: unknown[];
	allowed_mentions?: unknown;
	flags?: number;
	components?: unknown[];
	attachments?: unknown[];
}

export type ResponseAutoComplete = {
	choices: unknown[];
}

export type InteractionResponse<T> = {
	type: InteractionResponseType;
	data?: T;
}

export type ChannelCreateMessage = {
	content?: string;
	nonce?: number | string;
	tts?: boolean;
	embeds?:unknown[];
	allowed_mentions?: unknown;
	message_reference?: unknown;
	components?: MessageComponent[];
	sticker_ids?: string[];
	files?: unknown[];
	payload_json?: string;
	attachments?:unknown[];
	flags?: number;
}