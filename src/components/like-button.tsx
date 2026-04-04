"use client";

import { useOptimistic, useTransition } from "react";

import { toggleFamilyLike } from "@/server/family-actions";

type Props = {
  familyId: string;
  initialCount: number;
  initialLiked: boolean;
};

const LikeButton = ({ familyId, initialCount, initialLiked }: Props) => {
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { count: initialCount, liked: initialLiked },
    (_state, next: { count: number; liked: boolean }) => next,
  );

  function handleChange() {
    const next = { count: optimistic.liked ? optimistic.count - 1 : optimistic.count + 1, liked: !optimistic.liked };
    startTransition(async () => {
      setOptimistic(next);
      await toggleFamilyLike(familyId);
    });
  }

  return (
    <div className="like-wrapper">
      <style>{likeButtonStyles}</style>
      <div className="like-button">
        <input
          className="on"
          id={`heart-${familyId}`}
          type="checkbox"
          checked={optimistic.liked}
          onChange={handleChange}
        />
        <label className="like" htmlFor={`heart-${familyId}`}>
          <svg className="like-icon" fillRule="nonzero" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Like</title>
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
          <span className="like-text">Likes</span>
        </label>
        <span className="like-count one">{optimistic.liked ? optimistic.count - 1 : optimistic.count}</span>
        <span className="like-count two">{optimistic.liked ? optimistic.count : optimistic.count + 1}</span>
      </div>
    </div>
  );
};

const likeButtonStyles = `
  .like-wrapper [id^="heart-"] {
    display: none;
  }
  .like-wrapper .like-button {
    position: relative;
    cursor: pointer;
    display: flex;
    height: 48px;
    width: 136px;
    border-radius: 16px;
    border: 1.5px solid var(--border);
    background-color: var(--muted);
    overflow: hidden;
    box-shadow:
      inset -2px -2px 5px rgba(0, 0, 0, 0.05),
      inset 2px 2px 5px rgba(0, 0, 0, 0.05),
      4px 4px 10px rgba(0, 0, 0, 0.08),
      -2px -2px 8px rgba(0, 0, 0, 0.04);
    transition: background-color 0.2s, border-color 0.2s;
  }
  html.dark .like-wrapper .like-button {
    background-color: #1d1d1d;
    border-color: #3a3a3a;
    box-shadow:
      inset -2px -2px 5px rgba(255, 255, 255, 0.2),
      inset 2px 2px 5px rgba(0, 0, 0, 0.1),
      4px 4px 10px rgba(0, 0, 0, 0.4),
      -2px -2px 8px rgba(255, 255, 255, 0.1);
  }
  .like-wrapper .like {
    width: 70%;
    height: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: space-evenly;
  }
  .like-wrapper .like-icon {
    fill: var(--muted-foreground);
    height: 28px;
    width: 28px;
    transition: fill 0.2s;
  }
  .like-wrapper .like-text {
    color: var(--foreground);
    font-size: 16px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  .like-wrapper .like-count {
    position: absolute;
    right: 0;
        <div className="like-wrapper">
          <style>{likeButtonStyles}</style>
          <div className="like-button">
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--muted-foreground);
    font-size: 16px;
    border-left: 2px solid var(--border);
    transition: all 0.5s ease-out;
  }
  html.dark .like-wrapper .like-count {
    border-left-color: #4e4e4e;
  }
  .like-wrapper .like-count.two {
    transform: translateY(40px);
  }
  .like-wrapper .on:checked ~ .like .like-icon {
    fill: #fc4e4e;
    animation: like-enlarge 0.2s ease-out 1;
    transition: all 0.2s ease-out;
  }
  .like-wrapper .on:checked ~ .like-count.two {
    transform: translateX(0);
    color: var(--foreground);
  }
  .like-wrapper .on:checked ~ .like-count.one {
    transform: translateY(-40px);
  }
  @keyframes like-enlarge {
    0% { transform: scale(0.5); }
    100% { transform: scale(1.2); }
  }
`;

export default LikeButton;
