{
  /* this is its own thing in cell 1fr: carousel grid with 1fr, 2rem at bottom*/
}
<div className="h-full border-black border-4 grid grid-rows-[1fr_2rem]">
  {/* and now, this is its own thing inside carousel: carousel container, setting the 1fr cell, and 2rem cell */}
  <div className="h-full border-purple-800 bg-purple-800">
    {/* slider track in the 1fr cell*/}
    <div className="relative h-full w-full z-30 overflow-hidden">
      {/* slides container inside slider track */}
      <div className="h-full bg-blue-800 flex">
        {/* actual slides */}
        <div className="/* slide */ z-50 relative h-full w-full bg-teal-500">
          {/* a slide */}
          {/* first - image inset 0 absolute, fills entire container above */}
          {/* second - text or products commercial */}
          <div className="h-full w-full grid  gap-4 border-3 border-yellow-500">
            {/* products commercial */}
            <div className="h-full bg-pink-700 grid grid-cols-[33%_2fr] ">
              {/* a product card*/}
              <div className="h-full bg-green-400 grid ">
                {/* prod image cell */}
                <div className="h-full grid  bg-black text-white">
                  {/* prod img */}
                  <Link
                    href="/"
                    className="h-full text-white grid items-center justify-items-end bg-blue-500"
                  >
                    <Image
                      loading="lazy"
                      decoding="async"
                      quality={100}
                      sizes="(max-width: 768px) 36vw, 25vw"
                      // src="/api/placeholder/80/80"
                      src={logo}
                      // alt={product.name}
                      alt={""}
                      height={80}
                      width={80}
                      className=" aspect-square block rounded-sm"
                    />
                  </Link>
                </div>
              </div>
              <div className="h-full bg-orange-400 grid place-content-center">
                {/* prod text cell */}
                <div className="h-full bg-pink-800">
                  {/* prod text */}
                  <h1>
                    Some product name KSC BULTHAMA R NAN X-5000 V20 OHS TECEZ
                  </h1>
                  <p>Price 324 32352</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="h-full border-gray-800 bg-black text-white">
    {/* dots in the 2rem cell */}
    dots
  </div>
</div>;
