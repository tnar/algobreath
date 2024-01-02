import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteNote, getNote, createNote } from "~/models/note.server";
import React, { useEffect, useState } from "react";
import marked from "~/utils/marked";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const note = await getNote(context, params.slug);
  invariant(note, `Note not found: ${params.slug}`);

  return json({ note });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    const slug = formData.get("slug") as string;
    await deleteNote(context, slug);
    return redirect("/notes/admin"); // Redirect after deletion
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const markdown = formData.get("markdown") as string;

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await createNote(context, { title, slug, markdown });

  return redirect("/notes/admin");
};

export default function NotesAdminSlug() {
  const { note } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  // Initialize state for each input
  const [title, setTitle] = useState(note.title);
  const [slug, setSlug] = useState(note.slug);
  const [markdown, setMarkdown] = useState(note.markdown);

  const initialHtml = marked.parse(note.markdown);
  const [convertedHtml, setConvertedHtml] = useState(initialHtml);

  // Update the state when the note changes
  useEffect(() => {
    setTitle(note.title);
    setSlug(note.slug);
    setMarkdown(note.markdown);
    const initialHtml = marked.parse(note.markdown);
    setConvertedHtml(initialHtml);
  }, [note]); // Only re-run the effect if the note data changes

  // Change handlers
  const handleTitleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setTitle(e.target.value);
  const handleSlugChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSlug(e.target.value);
  const handleMarkdownChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);

    // Convert the new markdown to HTML and update the state
    const newHtml = marked.parse(newMarkdown as string);
    setConvertedHtml(newHtml);
  };

  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  return (
    <div className="flex flex-col lg:flex-row">
      <Form method="post" className="px-5">
        <p>
          <label>
            Note Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              className="input input-bordered w-full max-w-2xl"
              value={title} // Controlled by state
              onChange={handleTitleChange} // Update state on change
            />
          </label>
        </p>
        <p>
          <label>
            Note Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              className="input input-bordered w-full max-w-xs"
              value={slug} // Controlled by state
              onChange={handleSlugChange} // Update state on change
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className="textarea textarea-bordered w-full font-mono"
            value={markdown} // Controlled by state
            onChange={handleMarkdownChange} // Update state on change
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Note"}
          </button>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isSubmitting}
            onClick={(event) => {
              if (!confirm("Are you sure you want to delete this note?")) {
                if (event) {
                  event.preventDefault();
                }
              }
            }}
          >
            Delete Note
          </button>
        </p>
      </Form>
      <div
        className="prose prose-code:whitespace-pre-wrap prose-code:break-words px-2 sm:px-0"
        dangerouslySetInnerHTML={{ __html: convertedHtml }}
      />
    </div>
  );
}
