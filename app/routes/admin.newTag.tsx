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

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

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
    <div className="flex flex-col lg:flex-row">
      <Form method="post" className="px-5">
        <div>
          <label>
            Tag Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              className={inputClassName}
              value={title}
              onChange={handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Tag Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              className={inputClassName}
              value={slug}
              onChange={handleSlugChange}
            />
          </label>
        </div>
        <div className="text-right my-5">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Tag"}
          </button>
        </div>
      </Form>
    </div>
  );
}
