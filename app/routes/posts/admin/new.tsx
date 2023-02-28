import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";

import { createPost } from "~/models/post.server";
import { NewPostForm } from "~/domain/posts/PostForm";
import { validatePostFormData } from "~/domain/posts/validatePostFormData";
import { requireAdminUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAdminUser(request);
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  await requireAdminUser(request);

  const formData = await request.formData();

  const validationResult = validatePostFormData(formData);

  if (validationResult.hasErrors) {
    return json(validationResult.errors);
  }

  await createPost(validationResult.post);

  return redirect("/posts/admin");
};

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");

  return <NewPostForm errors={errors} loading={isCreating} />;
}
