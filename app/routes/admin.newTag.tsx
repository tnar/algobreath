import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createTag } from "~/models/tags.server";
import { useState } from "react";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();

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

  await createTag(context, { title, slug });

  return redirect(`/admin`);
};

export default function AdminNewTag() {
  const errors = useActionData<typeof action>();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

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
    const newTitle = e.target.value;
    setSlug(newTitle);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Form method="post" className="px-5">
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
          <button
            type="submit"
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Tag"}
          </button>
        </div>
      </Form>
    </div>
  );
}
