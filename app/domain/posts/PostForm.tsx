import { Form } from "@remix-run/react";
import type { FC, ReactNode } from "react";
import React from "react";
import type { Post } from "~/models/post.server";

type PostFormIntents = "create" | "update" | "delete";

type PostFormProps = {
  initialPost?: Post;
  errors?: {
    slug: string | null;
    title: string | null;
    markdown: string | null;
  };
  children?: React.ReactNode;
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
const PostForm: FC<PostFormProps> = ({ initialPost, errors, children }) => {
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={initialPost?.title}
          ></input>
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
            className={inputClassName}
            defaultValue={initialPost?.slug}
          ></input>
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
          className={`${inputClassName} font-mono`}
          defaultValue={initialPost?.markdown}
        ></textarea>
      </p>
      <div className="flex justify-end gap-4">{children}</div>
    </Form>
  );
};

export const NewPostForm: FC<
  Pick<PostFormProps, "errors"> & { readonly isCreating: boolean }
> = ({ errors, isCreating }) => {
  return (
    <PostForm errors={errors}>
      <IntentButton
        intent="create"
        className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Post"}
      </IntentButton>
    </PostForm>
  );
};

export const EditPostForm: FC<
  Pick<PostFormProps, "initialPost" | "errors"> & {
    readonly isUpdating: boolean;
    readonly isDeleting: boolean;
  }
> = ({ initialPost, errors, isUpdating, isDeleting }) => {
  const loading = isUpdating || isDeleting;

  return (
    <PostForm initialPost={initialPost} errors={errors}>
      <IntentButton
        intent="update"
        className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        disabled={loading}
      >
        {isUpdating ? "Updating..." : "Update Post"}
      </IntentButton>
      <IntentButton
        intent="delete"
        className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
        disabled={loading}
      >
        {isDeleting ? "Deleting..." : "Delete Post"}
      </IntentButton>
    </PostForm>
  );
};

type IntentButtonProps = React.HTMLProps<HTMLButtonElement> & {
  readonly intent: PostFormIntents;
  readonly children?: ReactNode;
};

const IntentButton: FC<IntentButtonProps> = ({
  intent,
  children,
  ...restButtonProps
}) => {
  return (
    <button {...restButtonProps} type="submit" name="intent" value={intent}>
      {children}
    </button>
  );
};
