import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { createNote } from "~/models/notes.server";
import { useState } from "react";
import marked from "~/utils/marked";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const tagIds = formData.getAll("tags") as string[];
  const markdown = formData.get("markdown") as string;

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    tags: tagIds ? null : "TagIds is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(
    Array.isArray(tagIds) && tagIds.every((tag) => typeof tag === "string"),
    "tags must be an array of strings"
  );
  invariant(typeof markdown === "string", "markdown must be a string");

  await createNote(context, { title, slug, markdown }, tagIds);

  return redirect(`/admin`);
};

export default function AdminNewNote() {
  const { tags } = useOutletContext() as { tags: Tag[] };

  const errors = useActionData<typeof action>();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [html, setHtml] = useState("");

  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  const titleToSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(titleToSlug(newTitle)); // Auto-generate the slug based on the title
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlug(newSlug);
  };

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
      <Form method="post" className="p-4">
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
              {isSubmitting ? "Creating..." : "Create Note"}
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
        </div>
      </Form>
      <div className="prose pt-8 px-4 sm:px-0">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
