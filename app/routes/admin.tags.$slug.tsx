import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deleteTag, getTag, updateTag } from "~/models/tags.server";
import React, { useEffect, useState } from "react";

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const tag = await getTag(context, params.slug);
  invariant(tag, `Tag not found: ${params.slug}`);

  return json({ tag });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (formData.get("_action") === "delete") {
    await deleteTag(context, Number(id));
    return redirect("/admin"); // Redirect after deletion
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");

  await updateTag(context, { id: Number(id), title, slug });

  return redirect("/admin");
};

export default function AdminTagsSlug() {
  const { tag } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  // Initialize state for each input
  const [title, setTitle] = useState(tag.title);
  const [slug, setSlug] = useState(tag.slug);

  // Update the state when the tag changes
  useEffect(() => {
    setTitle(tag.title);
    setSlug(tag.slug);
  }, [tag]); // Only re-run the effect if the tag data changes

  // Change handlers
  const handleTitleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setTitle(e.target.value);
  const handleSlugChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSlug(e.target.value);

  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === "submitting");

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Form method="post" className="px-5">
        <input type="hidden" name="id" value={tag.id} />
        <div>
          <label className="label">
            <span className="label-text">
              Tag Title:{" "}
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
              Tag Slug:{" "}
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
        <div className="text-right my-5">
          <div>
            <button
              type="submit"
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Tag"}
            </button>
          </div>
          <div>
            <button
              type="submit"
              name="_action"
              value="delete"
              className="btn my-5"
              disabled={isSubmitting}
              onClick={(event) => {
                if (!confirm("Are you sure you want to delete this tag?")) {
                  if (event) {
                    event.preventDefault();
                  }
                }
              }}
            >
              Delete Tag
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
