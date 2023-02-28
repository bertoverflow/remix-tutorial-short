import invariant from "tiny-invariant";
import type { Post } from "~/models/post.server";

type ValidateFormData =
  | {
      hasErrors: false;
      post: Post;
    }
  | {
      hasErrors: true;
      errors: {
        [k in keyof Post]: string | null;
      };
    };

export const validatePostFormData = (formData: FormData): ValidateFormData => {
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
    return { hasErrors, errors };
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  const post = { title, slug, markdown };

  return { hasErrors, post };
};
