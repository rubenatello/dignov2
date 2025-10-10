"use client";

import LikeCommentPanel from "@/components/LikeCommentPanel";

type Props = {
  slug: string;
  likedByMe?: boolean;
  likeCount?: number;
  commentCount?: number;
};

export default function ArticleEngagement({ slug, likedByMe, likeCount, commentCount }: Props) {
  return (
    <LikeCommentPanel
      slug={slug}
      likedByMe={likedByMe}
      likeCount={likeCount}
      commentCount={commentCount}
    />
  );
}
