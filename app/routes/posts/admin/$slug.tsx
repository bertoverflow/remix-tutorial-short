import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePost, getPost, updatePost } from "~/models/post.server";
import { EditPostForm } from "~/domain/posts/PostForm";
import { validatePostFormData } from "~/domain/posts/validatePostFormData";
import { requireAdminUser } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  await requireAdminUser(request);

  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export const action = async ({ request, params }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  await requireAdminUser(request);

  invariant(params.slug, `params.slug is required`);

  const formData = await request.formData();

  const intent = formData.get("intent");
  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }

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

  const transition = useTransition();
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";

  return (
    <EditPostForm
      key={post.slug}
      errors={errors}
      initialPost={post}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    />
  );
}
