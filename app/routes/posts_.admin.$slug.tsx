import type { ActionFunctionArgs } from "@remix-run/node";
import {
  LinksFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePost, getPost, createPost } from "~/models/post.server";
import React, { useEffect, useState } from "react";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/common";
import styles from "highlight.js/styles/github-dark-dimmed.min.css";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const post = await getPost(context, params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();

  if (formData.get("_action") === "delete") {
    const slug = formData.get("slug") as string;
    await deletePost(context, slug);
    return redirect("/posts/admin"); // Redirect after deletion
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

  await createPost(context, { title, slug, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  // Initialize state for each input
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [markdown, setMarkdown] = useState(post.markdown);

  const initialHtml = marked.parse(post.markdown);
  const [convertedHtml, setConvertedHtml] = useState(initialHtml);

  // Update the state when the post changes
  useEffect(() => {
    setTitle(post.title);
    setSlug(post.slug);
    setMarkdown(post.markdown);
    const initialHtml = marked.parse(post.markdown);
    setConvertedHtml(initialHtml);
  }, [post]); // Only re-run the effect if the post data changes

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
            Post Title:{" "}
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
            Post Slug:{" "}
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
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isSubmitting}
            onClick={(event) => {
              if (!confirm("Are you sure you want to delete this post?")) {
                if (event) {
                  event.preventDefault();
                }
              }
            }}
          >
            Delete Post
          </button>
        </p>
      </Form>
      <div
        className="prose prose-code:whitespace-pre-wrap prose-code:break-words"
        dangerouslySetInnerHTML={{ __html: convertedHtml }}
      />
    </div>
  );
}
