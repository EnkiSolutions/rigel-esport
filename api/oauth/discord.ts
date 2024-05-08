import { VercelRequest, VercelResponse } from "@vercel/node";
import { connect } from "../../backend/rbac-discord/authn";

/**
 * Connect to RBAC via Discord
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request: VercelRequest, response: VercelResponse) => {
    response.send(
        await connect(
            request.body.code,
            request.body.origin
        )
    );
};