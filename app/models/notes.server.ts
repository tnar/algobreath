import type { AppLoadContext } from "@remix-run/cloudflare";

const bearerAuthToken = "fDxp29GNfUQ9q2wjYGKH";

export async function getNotes(context: AppLoadContext) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notes`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const notes: NoteSlugAndTitle[] = await res.json();
  return notes;
}

export async function getLatestNote(context: AppLoadContext) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notes/latest`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const note: Note = await res.json();
  return note;
}

export async function getNote(context: AppLoadContext, slug: string) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notes/${slug}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const note: Note = await res.json();
  return note;
}

export async function createNote(
  context: AppLoadContext,
  note: NewNote,
  tagIds: string[]
) {
  const env = context.env as Env;

  const res = await fetch(`${env.WORKER_HOST}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearerAuthToken,
    },
    body: JSON.stringify(note),
  });

  const noteId: number = await res.json();
  await Promise.all(
    tagIds.map((tagId) =>
      fetch(`${env.WORKER_HOST}/notesToTags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerAuthToken,
        },
        body: JSON.stringify({
          noteId,
          tagId,
        }),
      })
    )
  );

  return;
}

export async function updateNote(
  context: AppLoadContext,
  note: Note,
  addTagIds: string[],
  removeTagIds: string[]
) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearerAuthToken,
    },
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error("Failed to update note");
  }

  if (addTagIds.length > 0) {
    await Promise.all(
      addTagIds.map((tagId) =>
        fetch(`${env.WORKER_HOST}/notesToTags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerAuthToken,
          },
          body: JSON.stringify({
            noteId: note.id,
            tagId,
          }),
        })
      )
    );
  }

  if (removeTagIds.length > 0) {
    await Promise.all(
      removeTagIds.map((tagId) =>
        fetch(`${env.WORKER_HOST}/notesToTags/${note.id}/${tagId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerAuthToken,
          },
        })
      )
    );
  }

  return;
}

export async function deleteNote(context: AppLoadContext, id: string) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });

  return res;
}

export async function getNotesFromTag(context: AppLoadContext, tagId: number) {
  const env = context.env as Env;
  const res = await fetch(`${env.WORKER_HOST}/notesToTags/tags/${tagId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + bearerAuthToken,
    },
  });
  const notes: Note[] = await res.json();
  return notes;
}
