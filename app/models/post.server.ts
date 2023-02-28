import { prisma } from "~/db.server";

import type { Post as PrismaPost } from "@prisma/client";

export type Post = Pick<PrismaPost, "slug" | "title" | "markdown">;

export async function getPostListings() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: Post) {
  return prisma.post.create({ data: post });
}

export async function updatePost(post: Post) {
  return prisma.post.update({ where: { slug: post.slug }, data: post });
}
