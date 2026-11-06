import { VercelRequest, VercelResponse } from "@vercel/node";
import { serialize } from "cookie";

type GithubTokenResponse = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_token_expires_in?: number;
    error?: string;
    error_description?: string;
};

type GithubRequestBody = {
    code?: unknown;
    redirectUri?: unknown;
};

export default async (request: VercelRequest, response: VercelResponse) => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({
            error: 'method_not_allowed',
            message: 'Cette route accepte uniquement les requêtes POST.'
        });
    }

    const { code, redirectUri } = getRequestData(request.body);
    const clientId = process.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!code) {
        return response.status(400).json({
            error: 'missing_code',
            message: "Le code d’autorisation GitHub est manquant."
        });
    }

    if (!clientId || !clientSecret) {
        console.error('GitHub OAuth is missing VITE_GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.');
        return response.status(500).json({
            error: 'github_oauth_not_configured',
            message: "L’authentification GitHub n’est pas configurée sur le serveur."
        });
    }

    try {
        const tokenParameters = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code
        });

        if (redirectUri) tokenParameters.set('redirect_uri', redirectUri);

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'rigel-esport'
            },
            body: tokenParameters
        });
        const tokenPayload = await readJson<GithubTokenResponse>(tokenResponse);

        if (!tokenPayload) {
            console.error('GitHub OAuth returned a non-JSON response.', {
                status: tokenResponse.status,
                contentType: tokenResponse.headers.get('content-type')
            });
            return response.status(502).json({
                error: 'github_oauth_unavailable',
                message: 'GitHub a renvoyé une réponse inattendue. Veuillez réessayer.'
            });
        }

        if (!tokenResponse.ok || tokenPayload.error || !tokenPayload.access_token) {
            const upstreamUnavailable = tokenResponse.status >= 500;
            return response.status(upstreamUnavailable ? 502 : 401).json({
                error: tokenPayload.error ?? 'github_oauth_failed',
                message: tokenPayload.error_description
                    ?? "GitHub a refusé le code d’autorisation. Veuillez recommencer la connexion."
            });
        }

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${tokenPayload.access_token}`,
                'User-Agent': 'rigel-esport',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const githubUser = await readJson<Record<string, unknown>>(userResponse);

        if (!githubUser || !userResponse.ok) {
            console.error('GitHub user validation failed.', {
                status: userResponse.status,
                contentType: userResponse.headers.get('content-type')
            });
            return response.status(userResponse.status >= 500 ? 502 : 401).json({
                error: 'github_user_validation_failed',
                message: "Impossible de valider l’utilisateur GitHub. Veuillez recommencer la connexion."
            });
        }

        const cookies = [
            serialize('github_token', tokenPayload.access_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: tokenPayload.expires_in ?? 28800
            })
        ];

        if (tokenPayload.refresh_token) {
            cookies.push(serialize('github_refresh_token', tokenPayload.refresh_token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: tokenPayload.refresh_token_expires_in ?? 15811200
            }));
        }

        return response
            .status(200)
            .setHeader('Set-Cookie', cookies)
            .json(githubUser);
    } catch (error) {
        console.error(
            'GitHub OAuth request failed.',
            error instanceof Error ? error.message : error
        );
        return response.status(502).json({
            error: 'github_oauth_unavailable',
            message: 'La connexion à GitHub a échoué. Veuillez réessayer.'
        });
    }
};

function getRequestData(body: unknown): { code?: string; redirectUri?: string } {
    if (typeof body === 'string') return { code: body.trim() };
    if (!body || typeof body !== 'object') return {};

    const requestBody = body as GithubRequestBody;
    return {
        code: typeof requestBody.code === 'string' ? requestBody.code.trim() : undefined,
        redirectUri: typeof requestBody.redirectUri === 'string'
            ? requestBody.redirectUri
            : undefined
    };
}

async function readJson<T>(upstreamResponse: Response): Promise<T | null> {
    const body = await upstreamResponse.text();
    if (!body) return null;

    try {
        return JSON.parse(body) as T;
    } catch {
        return null;
    }
}
