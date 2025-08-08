import { keyframe } from "@tjcages/keyframe"
import { ArrowRight } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative z-10 mb-2">
      <div className="mx-auto w-full max-w-[1480px] px-2 pt-2 md:pt-0">
        <div className="bg-bg-primary shadow-stack relative min-h-[600px] overflow-hidden rounded-2xl">
          <div className="max-w-8xl absolute inset-0 z-0 flex flex-col items-start justify-between gap-10 overflow-hidden p-6 md:p-8 lg:p-12 xl:p-16">
            {/* Top banner */}
            <keyframe.div className="flex w-full" duration={1} delay={3}>
              <a
                href="/"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-orange-600 px-3 py-2 text-sm font-light text-white/80 md:px-4 md:py-2.5 md:text-base"
              >
                <span className="leading-tight">
                  <span className="hidden sm:inline">
                    Speak at Cloudflare Connect and save with{" "}
                  </span>
                  <span className="sm:hidden">Cloudflare Connect - </span>
                  <span className="font-medium">early bird registration</span>
                </span>
                <ArrowRight className="size-3 flex-shrink-0 text-white/80 md:size-3.5" />
              </a>
            </keyframe.div>

            {/* Main hero content */}
            <div className="flex h-full flex-col justify-center gap-10">
              <keyframe.h1
                className="display max-w-[912px] text-white"
                delay={0.2}
              >
                {`Build on the infrastructure\npowering 20% of the Internet.`}
              </keyframe.h1>

              {/* subtext */}
              <div className="flex flex-col">
                <keyframe.h5
                  className="subtext max-w-[700px] leading-tight text-white"
                  delay={0.8}
                >
                  From your first line of code to your millionth user,
                </keyframe.h5>
                <keyframe.h5
                  className="subtext font-light text-white/80"
                  delay={1.6}
                >
                  Cloudflare lets you ship software instead of managing
                  infrastructure.
                </keyframe.h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
