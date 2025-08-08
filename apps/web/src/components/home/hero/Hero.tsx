import { Content } from "./_content"

export function Hero() {
  return (
    <section className="relative z-10 mb-2">
      <div className="mx-auto w-full max-w-[1480px] px-2 pt-2 md:pt-0">
        <div className="bg-bg-primary shadow-stack relative min-h-[600px] overflow-hidden rounded-2xl">
          <Content />
        </div>
      </div>
    </section>
  )
}

export default Hero


