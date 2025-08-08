"use client"

import type { AnimationType } from "@tjcages/keyframe"
import { keyframe as Keyframe } from "@tjcages/keyframe"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Graphic } from "@/components/home/hero/_graphic"
import { cn } from "@/lib/utils"

// Define stable animation arrays outside component to prevent recreation
const SOLUTIONS_ANIMATION: AnimationType[] = ["fade", "blur"]

const solutions = [
  {
    title: "Compute",
    icon: "flash",
    graphic: "/static/compute-graphic.png",
  },
  {
    title: "Media",
    icon: "cube",
    graphic: "/static/media-graphic.png",
  },
  {
    title: "AI",
    icon: "aI",
    graphic: "/static/ai-graphic.png",
  },
  {
    title: "Databases",
    icon: "cloud",
    graphic: "/static/databases-graphic.png",
  },
]

// Animation timing constants
const AUTO_ROTATE_DELAY_MS = 4000
const AUTO_ROTATE_INTERVAL_MS = 4000

export function Content() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoRotating(true)
    }, AUTO_ROTATE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isAutoRotating) return

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % solutions.length)
    }, AUTO_ROTATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isAutoRotating])

  const handleMouseEnter = (index: number) => {
    setIsAutoRotating(false)
    setSelectedIndex(index)
  }

  const handleMouseLeave = () => {
    setIsAutoRotating(true)
  }

  const safeIndex =
    ((selectedIndex % solutions.length) + solutions.length) % solutions.length
  const currentGraphic =
    solutions[safeIndex]?.graphic ?? "/static/compute-graphic.png"

  return (
    <>
      <Graphic selectedGraphic={currentGraphic} />
      <div className="max-w-8xl absolute inset-0 z-0 flex flex-col items-start justify-between gap-10 overflow-hidden p-6 md:p-8 lg:p-12 xl:p-16">
        {/* Top banner */}
        <Keyframe.div className="flex w-full" duration={1} delay={3}>
          <a
            href="/"
            className="text-white/80 border-white/10 flex items-center gap-2 rounded-lg border bg-orange-600 px-3 py-2 text-sm font-light md:px-4 md:py-2.5 md:text-base"
          >
            <span className="leading-tight">
              <span className="hidden sm:inline">
                Speak at Cloudflare Connect and save with{" "}
              </span>
              <span className="sm:hidden">Cloudflare Connect - </span>
              <span className="font-medium">early bird registration</span>
            </span>
            <ArrowRight className="text-white/80 size-3 flex-shrink-0 md:size-3.5" />
          </a>
        </Keyframe.div>

        {/* Main hero content */}
        <div className="flex h-full flex-col justify-center gap-10">
          <Keyframe.h1 className="display text-white max-w-[912px]" delay={0.2}>
            {`Build on the infrastructure\npowering 20% of the Internet.`}
          </Keyframe.h1>

          {/* subtext */}
          <div className="flex flex-col">
            <Keyframe.h5
              className="subtext text-white max-w-[700px] leading-tight"
              delay={0.8}
            >
              From your first line of code to your millionth user,
            </Keyframe.h5>
            <Keyframe.h5
              className="text-white/80 subtext font-light"
              delay={1.6}
            >
              Cloudflare lets you ship software instead of managing
              infrastructure.
            </Keyframe.h5>
          </div>

          {/* Solutions section */}
          <Keyframe.div
            className="flex items-center"
            animation={SOLUTIONS_ANIMATION}
            duration={1.4}
            delay={0.8}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-3">
              <span className="text-white/80 text-sm">Trending solutions:</span>
              <ul className="flex items-center gap-2">
                {solutions.map((s, i) => (
                  <li key={s.title}>
                    <button
                      type="button"
                      onMouseEnter={() => handleMouseEnter(i)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm transition-colors",
                        i === selectedIndex
                          ? "bg-orange-600 text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20",
                      )}
                      aria-pressed={i === selectedIndex}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Keyframe.div>
        </div>
      </div>
    </>
  )
}
