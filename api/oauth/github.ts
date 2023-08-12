import { VercelRequest, VercelResponse } from "@vercel/node";
import { serialize } from "cookie";

export default async (request: VercelRequest, response: VercelResponse) => {
    const req = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.VITE_GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: request.body,
            repository_id: process.env.GITHUB_REPOSITORY_ID
        }),
    });
    const json = await req.json()
    const { access_token, refresh_token } = json;
    response
        .setHeader('Set-Cookie', [
            serialize(
                'github_token',
                access_token,
                {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    maxAge: 28800
                },            
            ),
            serialize(
                'github_refresh_token',
                refresh_token,
                {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    maxAge: 15811200
                },            
            ),
        ])
        .send(await getGithubUser(access_token));
}

async function getGithubUser(access_token: string) {
    return (await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })).json();
}