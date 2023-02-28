import { Form } from "@remix-run/react";
import type { FC } from "react";
import type { Post } from "~/models/post.server";

type PostFormProps = {
  initialPost?: Post;
  errors?: {
    slug: string | null;
    title: string | null;
    markdown: string | null;
  };
  disabled: boolean;
  buttonText: string;
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
export const PostForm: FC<PostFormProps> = ({
  initialPost,
  errors,
  disabled,
  buttonText,
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
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={disabled}
        >
          {buttonText}
        </button>
      </p>
    </Form>
  );
};
