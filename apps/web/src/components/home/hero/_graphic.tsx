"use client"

import { type AnimationType, keyframe } from "@tjcages/keyframe"
import Image from "next/image"

interface GraphicProps {
  selectedGraphic: string
}

const ANIMATION: AnimationType[] = ["fade"]

export const Graphic = ({ selectedGraphic }: GraphicProps) => {
  return (
    <keyframe.div
      className="absolute top-0 right-0 bottom-0 left-0"
      animation={ANIMATION}
      delay={3}
    >
      <Image
        src={selectedGraphic}
        alt="Hero background"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="from-bg-primary/0 to-bg-primary absolute bottom-0 left-0 h-3/4 w-3/4 bg-linear-to-bl" />
    </keyframe.div>
  )
}
