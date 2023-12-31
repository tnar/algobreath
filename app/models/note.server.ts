import type { AppLoadContext } from "@remix-run/cloudflare";

interface Note {
    slug: string;
    title: string;
    markdown: string;
    createdAt?: number;
    updatedAt?: number;
}

const bearerAuthToken = 'fDxp29GNfUQ9q2wjYGKH'

export async function getNotes(context: AppLoadContext) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/getNotes`, {
        method: 'GET', // or 'POST', 'PUT', etc.
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        }
    });
    const notes: Note[] = await res.json();
    return notes;
}

export async function getNote(context: AppLoadContext, slug: string) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/notes/${slug}`, {
        method: 'GET', // or 'POST', 'PUT', etc.
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        }
    });
    const note: Note = await res.json();
    return note;
}

export async function createNote(context: AppLoadContext, note: Note) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/createNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + bearerAuthToken,
        },
        body: JSON.stringify(note),
    });
    return res;
}

// export async function updateNote(context: AppLoadContext, note: Note) {
//     const env = context.env as Env;
//     const res = await fetch(`${env.WORKER_HOST}/updateNote`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             'Authorization': basicAuthHeader
//         },
//         body: JSON.stringify(note),
//     });
//     return res;
// }

export async function deleteNote(context: AppLoadContext, slug: string) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/notes/${slug}`, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        },
    });
    return res;
}
