import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteNote, getNote, updateNote } from "~/models/notes.server";
import React, { useEffect, useState } from "react";
import marked from "~/utils/marked";
import { getTagsForNote } from "~/models/tags.server";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const note = await getNote(context, params.slug);
  invariant(note, `Note not found: ${params.slug}`);
  const tagIds = await getTagsForNote(context, note.id);
  invariant(tagIds, `Tags for Note not found: ${note.id}`);
  const initTagIds = tagIds.map((tagId) => tagId.toString());

  return json({ note, initTagIds });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  if (formData.get("_action") === "delete") {
    await deleteNote(context, id);
    return redirect("/admin"); // Redirect after deletion
  }

  const initTagIds = (formData.get("initTagIds") as string).split(",");

  const title = formData.get("title");
  const slug = formData.get("slug") as string;
  const tagIds = formData.getAll("tags") as string[];
  const markdown = formData.get("markdown") as string;

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    tags: tagIds ? null : "Tag is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof id === "string", "id must be a string");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(
    Array.isArray(initTagIds) &&
      initTagIds.every((tag) => typeof tag === "string"),
    "tags must be an array of strings"
  );
  invariant(
    Array.isArray(tagIds) && tagIds.every((tag) => typeof tag === "string"),
    "tags must be an array of strings"
  );
  invariant(typeof markdown === "string", "markdown must be a string");

  const addTagIds = tagIds.filter((tagId) => !initTagIds.includes(tagId));
  const removeTagIds = initTagIds.filter(
    (initTagId) => !tagIds.includes(initTagId)
  );

  await updateNote(
    context,
    { id: Number(id), title, slug, markdown },
    addTagIds,
    removeTagIds
  );

  return redirect("/admin");
};

export default function AdminNotesSlug() {
  const { tags } = useOutletContext() as { tags: Tag[] };

  const { note, initTagIds } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const [title, setTitle] = useState(note.title);
  const [slug, setSlug] = useState(note.slug);
  const [tagIds, setTagIds] = useState<string[]>(initTagIds);
  const [markdown, setMarkdown] = useState(note.markdown);

  const initialHtml = marked.parse(note.markdown);
  const [html, setHtml] = useState(initialHtml);

  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  useEffect(() => {
    setTitle(note.title);
    setSlug(note.slug);
    setTagIds(initTagIds);
    setMarkdown(note.markdown);

    const initialHtml = marked.parse(note.markdown);
    setHtml(initialHtml);
  }, [note, initTagIds]); // Only re-run the effect if the note data changes

  // Change handlers
  const handleTitleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setTitle(e.target.value);

  const handleSlugChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSlug(e.target.value);

  const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTags = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setTagIds(newTags);
  };

  const handleMarkdownChange = async (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const newMarkdown = e.target.value as string;
    setMarkdown(newMarkdown);
    const newHtml = await marked.parse(newMarkdown as string);
    setHtml(newHtml);
  };

  const handleLatexClick = async () => {
    const markdown = document.getElementById("markdown") as HTMLTextAreaElement;
    const newMarkdown = markdown.value.replace(
      /\\(\(|\[)|\\(\)|\])/g,
      (match) => {
        switch (match) {
          case "\\(":
          case "\\)":
            return "$";
          case "\\[":
          case "\\]":
            return "$$";
          default:
            return match;
        }
      }
    );
    const newHtml = await marked.parse(newMarkdown);
    setHtml(newHtml);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Form method="post" className="px-5">
        <input type="hidden" name="id" value={note.id} />
        <input type="hidden" name="initTagIds" value={initTagIds} />
        <div>
          <label className="label">
            <span className="label-text">
              Note Title:{" "}
              {errors?.title ? (
                <em className="text-red-600">{errors.title}</em>
              ) : null}
            </span>
          </label>
          <input
            type="text"
            name="title"
            className="input input-bordered w-full max-w-xs"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">
              Note Slug:{" "}
              {errors?.slug ? (
                <em className="text-red-600">{errors.slug}</em>
              ) : null}
            </span>
          </label>
          <input
            type="text"
            name="slug"
            className="input input-bordered w-full max-w-xs"
            value={slug}
            onChange={handleSlugChange}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">
              Note Tags:{" "}
              {errors?.tags ? (
                <em className="text-red-600">{errors.tags}</em>
              ) : null}
            </span>
          </label>
          <select
            multiple
            className="select select-bordered"
            name="tags"
            onChange={handleTagsChange}
            value={tagIds}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text">
              Markdown:{" "}
              {errors?.markdown ? (
                <em className="text-red-600">{errors.markdown}</em>
              ) : null}
            </span>
          </label>
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className="textarea textarea-bordered w-full font-mono"
            value={markdown}
            onChange={handleMarkdownChange}
          />
        </div>
        <div className="text-right my-5">
          <div>
            <button
              type="submit"
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Note"}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-outline my-5"
              onClick={handleLatexClick}
            >
              Handle Latex
            </button>
          </div>
          <div>
            <button
              type="submit"
              name="_action"
              value="delete"
              className="btn"
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
          </div>
        </div>
      </Form>
      <div className="prose prose-code:whitespace-pre-wrap prose-code:break-words pt-10 px-4 sm:px-0">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
