export default function (code: string):Record<string, { init: RequestInit, name: string }> {
    return {
        discord: {
            name: 'Discord',
            init: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, origin: window.location.origin })
            }
        },
        github: {
            name: 'GitHub',
            init: {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: code
            }
        }
    }
};