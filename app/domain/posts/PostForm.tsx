import { Form } from "@remix-run/react";
import type { FC } from "react";
import type { Post } from "~/models/post.server";

// TODO how to make this type work !?!?!?!
export const POST_FORM_INTENTS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;

type POST_FORM_INTENTS_TYPE =
  (typeof POST_FORM_INTENTS)[keyof typeof POST_FORM_INTENTS];

type PostFormProps = {
  initialPost?: Post;
  errors?: {
    slug: string | null;
    title: string | null;
    markdown: string | null;
  };
  loading: boolean;
  actionButtonText: string;
  actionButtonIntent: Exclude<POST_FORM_INTENTS_TYPE, "delete">; // TODO use type from above
  children?: React.ReactNode;
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
const PostForm: FC<PostFormProps> = ({
  initialPost,
  errors,
  loading,
  actionButtonText,
  actionButtonIntent,
  children,
}) => {
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
      <div className="flex justify-end gap-4">
        {children}
        <button
          type="submit"
          name="intent"
          value={actionButtonIntent}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={loading}
        >
          {actionButtonText}
        </button>
      </div>
    </Form>
  );
};

export const NewPostForm: FC<Pick<PostFormProps, "errors" | "loading">> = ({
  errors,
  loading,
}) => {
  return (
    <PostForm
      errors={errors}
      loading={loading}
      actionButtonIntent="create"
      actionButtonText={loading ? "Creating..." : "Create Post"}
    ></PostForm>
  );
};

export const EditPostForm: FC<
  Pick<PostFormProps, "initialPost" | "errors" | "loading">
> = ({ initialPost, errors, loading }) => {
  return (
    <PostForm
      initialPost={initialPost}
      errors={errors}
      loading={loading}
      actionButtonIntent="update"
      actionButtonText={loading ? "Updating..." : "Update Post"}
    >
      <button
        type="submit"
        name="intent"
        value={POST_FORM_INTENTS.DELETE}
        className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Post"}
      </button>
    </PostForm>
  );
};
