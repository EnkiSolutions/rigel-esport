import { VercelRequest, VercelResponse } from "@vercel/node";
import backendResponse from "../../backend";

/**
 * Gotta see someone 'bout a trout
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request: VercelRequest, response: VercelResponse) => {
	// Only respond to POST requests
	if (request.method === "POST") {
		const { status, body } = await backendResponse(
			request.body,
			request.headers["x-signature-ed25519"] as string,
			request.headers["x-signature-timestamp"] as string,
			process.env.PUBLIC_KEY!
		);

		if (status) response.status(status).send(body);
		else response.send(body);
	}
};