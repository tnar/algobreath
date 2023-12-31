import type { AppLoadContext } from "@remix-run/cloudflare";

interface Post {
    slug: string;
    title: string;
    markdown: string;
    createdAt?: number;
    updatedAt?: number;
}

const bearerAuthToken = 'fDxp29GNfUQ9q2wjYGKH'

export async function getPosts(context: AppLoadContext) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/getPosts`, {
        method: 'GET', // or 'POST', 'PUT', etc.
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        }
    });
    const posts: Post[] = await res.json();
    return posts;
}

export async function getPost(context: AppLoadContext, slug: string) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/posts/${slug}`, {
        method: 'GET', // or 'POST', 'PUT', etc.
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        }
    });
    const post: Post = await res.json();
    return post;
}

export async function createPost(context: AppLoadContext, post: Post) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/createPost`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + bearerAuthToken,
        },
        body: JSON.stringify(post),
    });
    return res;
}

// export async function updatePost(context: AppLoadContext, post: Post) {
//     const env = context.env as Env;
//     const res = await fetch(`${env.WORKER_HOST}/updatePost`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             'Authorization': basicAuthHeader
//         },
//         body: JSON.stringify(post),
//     });
//     return res;
// }

export async function deletePost(context: AppLoadContext, slug: string) {
    const env = context.env as Env;
    const res = await fetch(`${env.WORKER_HOST}/posts/${slug}`, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + bearerAuthToken,
        },
    });
    return res;
}
