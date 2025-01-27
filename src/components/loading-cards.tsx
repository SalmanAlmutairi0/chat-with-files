import React from "react";
import SkeletonCard from "./skeleton-card";

export default function LoadingCard() {
  return (
    <>
      {Array(9)
        .fill(null)
        .map((_, index: number) => (
          <SkeletonCard key={index} />
        ))}
    </>
  );
}
