import Features from "./features"

const FeaturedServices = () => {
  return (
    <section>
      <div className="relative h-full w-full">
        <div className="relative w-full pt-0 pb-6 before:absolute before:top-24 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:blur-3xl md:pt-20 md:pb-10 dark:before:-z-10 dark:before:rounded-full dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:blur-3xl">
          <div className="relative z-10 container mx-auto">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
              <Features />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedServices
