import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost, updatePost } from "~/models/post.server";
import { PostForm } from "~/domain/posts/PostForm";
import { validatePostFormData } from "~/domain/posts/validatePostFormData";

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

  const validationResult = validatePostFormData(formData);

  if (validationResult.hasErrors) {
    return json(validationResult.errors);
  }

  await updatePost(validationResult.post);

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
