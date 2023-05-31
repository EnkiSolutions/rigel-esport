import fetch from 'node-fetch';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
    const id = process.env.TWITCH_CLIENT_ID;
    const twitchResponse = await fetch("https://id.twitch.tv/oauth2/token", {
        body: "client_id="+ id +"&client_secret="+ process.env.TWITCH_SECRET +"&grant_type=client_credentials",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });

    const json = await twitchResponse.json();

    console.log("Body");
    console.log(request.body);

  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
    twitchHeader: {
      "Authorization": "Bearer " + json.access_token,
      "Client-Id": id
    } as HeadersInit
  });
}