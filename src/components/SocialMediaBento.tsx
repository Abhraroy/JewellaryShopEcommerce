import Image from "next/image";

export default function SocialMediaBento() {
  return (
    <section className="w-full py-12 md:py-16 px-0">
          <div className="w-full">
            {/* Heading row */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-8 px-4 sm:px-6 lg:px-10 text-center">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-lime-500">
                Social Gallery
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                See how our jewellery lives on social
              </h2>
              <button
                type="button"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm md:text-base font-semibold shadow-lg hover:shadow-xl hover:bg-lime-400 hover:text-black transition-all duration-200"
              >
                Follow our socials
                <span className="ml-2 text-lg leading-none">↗</span>
              </button>
            </div>

            {/* Bento grid inspired by reference image - now using images in each tile */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 text-white px-2 sm:px-4 lg:px-6">
              {/* Left column cluster */}
              <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {/* Reels card */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Reels preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-lime-300">
                        Reels
                      </span>
                      <p className="text-lg md:text-xl font-extrabold leading-tight mt-2">
                        No filter,
                        <br />
                        just shine.
                      </p>
                    </div>
                  </div>
                  {/* Stories card */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Stories preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 p-3 md:p-4 flex flex-col justify-between h-full text-black">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] bg-white/80 px-2 py-1 rounded-full w-fit">
                        Stories
                      </span>
                      <p className="mt-1 text-xs md:text-sm font-medium text-white">
                        Daily styling tips & drops.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {/* Instagram card */}
                  <div className="col-span-3 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="Instagram grid"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-700/50 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                        Instagram
                      </p>
                      <p className="mt-2 text-lg md:text-xl font-bold leading-tight">
                        Plastic free,
                        <br />
                        planet friendly
                      </p>
                      <span className="mt-3 inline-flex items-center text-[11px] font-medium bg-black/60 px-2 py-1 rounded-full w-fit">
                        @yourbrand
                      </span>
                    </div>
                  </div>
                  {/* New drops small tile */}
                  <div className="col-span-1 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="New drops"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 p-2 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white text-center bg-black/50 px-2 py-1 rounded-full">
                        New
                        <br />
                        drops
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center tall tiles */}
              <div className="col-span-4 md:col-span-3 space-y-3 md:space-y-4">
                {/* More glow banner */}
                <div className="relative rounded-2xl overflow-hidden h-32 md:h-40">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="More glow banner"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-4 flex items-center justify-center h-full">
                    <p className="text-xl md:text-2xl font-extrabold tracking-tight text-white text-center">
                      More glow,
                      <span className="text-black ml-1 px-2 py-1 rounded-full bg-yellow-300">
                        less noise
                      </span>
                    </p>
                  </div>
                </div>
                {/* TikTok / YouTube row */}
                <div className="grid grid-cols-4 gap-3 md:gap-4 h-40 md:h-48">
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="TikTok behind the scenes"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-purple-200">
                        TikTok
                      </p>
                      <p className="text-sm md:text-base font-medium mt-2">
                        Behind-the-scenes
                        <br />
                        from our studio.
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://battulaaljewels.com/website/images/product-banner.webp"
                      alt="YouTube stories"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-50">
                        YouTube
                      </p>
                      <p className="text-lg md:text-xl font-bold leading-tight mt-2">
                        Craft stories
                        <br />
                        in motion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right narrow column */}
              <div className="hidden md:flex md:flex-col md:col-span-2 space-y-4">
                <div className="relative rounded-2xl overflow-hidden h-32">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Choose positivity"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-white/80" />
                  <div className="relative z-10 p-4 text-black flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em]">
                      Choose
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs font-semibold">
                      <span className="px-2 py-1 rounded-full bg-black text-white">
                        Love
                      </span>
                      <span className="px-2 py-1 rounded-full bg-pink-500 text-white">
                        Shine
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-40">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Community looks"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/80 via-emerald-400/40 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                      Community
                    </p>
                    <p className="text-sm font-medium">
                      Tag us in your
                      <br />
                      favourite looks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second bento row to fill width more strongly, also image-based */}
            <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 text-white px-2 sm:px-4 lg:px-6">
              <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Live sparkle"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                      Live
                    </p>
                    <p className="text-lg md:text-xl font-extrabold leading-tight mt-2">
                      Sparkle in
                      <br />
                      real time.
                    </p>
                  </div>
                </div>
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Collab edits"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-pink-600/70" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-pink-100">
                      Collabs
                    </p>
                    <p className="text-xs md:text-sm font-medium mt-2">
                      Creator edits &
                      <br />
                      style challenges.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 md:col-span-4 grid grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Pinterest moodboard"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo-900/70" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-200">
                      Pinterest
                    </p>
                    <p className="text-sm md:text-base font-medium mt-2">
                      Save dream looks
                      <br />
                      for later.
                    </p>
                  </div>
                </div>
                <div className="col-span-2 relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://battulaaljewels.com/website/images/product-banner.webp"
                    alt="Highlights grid"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-300/90 via-orange-500/70 to-transparent" />
                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-black">
                      Highlights
                    </p>
                    <p className="text-lg md:text-xl font-extrabold leading-tight text-black mt-2">
                      Let&apos;s
                      <br />
                      make it great.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}