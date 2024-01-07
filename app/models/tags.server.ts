import type { AppLoadContext } from "@remix-run/cloudflare";

const bearerAuthToken = "fDxp29GNfUQ9q2wjYGKH";

export async function getTags(context: AppLoadContext) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/tags`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const tags: Tag[] = await res.json();
  return tags;
}

export async function getTag(context: AppLoadContext, slug: string) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/tags/${slug}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const note: Tag = await res.json();
  return note;
}

export async function createTag(context: AppLoadContext, tag: NewTag) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearerAuthToken,
    },
    body: JSON.stringify(tag),
  });
  return res;
}

export async function updateTag(context: AppLoadContext, tag: Tag) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/tags`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearerAuthToken,
    },
    body: JSON.stringify(tag),
  });
  return res;
}

export async function deleteTag(context: AppLoadContext, id: number) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/tags/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  return res;
}

export async function getTagsForNote(context: AppLoadContext, noteId: number) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notesToTags/notes/${noteId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const tags: Tag[] = await res.json();
  return tags;
}
