import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";

import { createPost } from "~/models/post.server";
import { PostForm } from "~/domain/posts/PostForm";
import { validatePostFormData } from "~/domain/posts/validatePostFormData";

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

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

  return (
    <PostForm
      errors={errors}
      disabled={isCreating}
      buttonText={isCreating ? "Creating..." : "Create Post"}
    />
  );
}
