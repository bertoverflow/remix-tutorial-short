import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost, updatePost } from "~/models/post.server";
import { PostForm } from "~/components/PostForm";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

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

  await updatePost({ title, slug, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isSaving = Boolean(navigation.state === "submitting");

  return (
    <PostForm
      key={post.slug}
      errors={errors}
      initialPost={post}
      disabled={isSaving}
      buttonText={isSaving ? "Saving..." : "Save Post"}
    />
  );
}
