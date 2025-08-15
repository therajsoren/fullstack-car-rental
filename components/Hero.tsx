import Image from "next/image";

const Hero = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 pt-0.5">
      <div className="leading-normal space-y-4 p-2">
        <h1 className="md:text-6xl text-4xl font-black">
          Your City's Premium
          <span> Mobility</span>Hub:
          <span className="bg-gradient-to-b from-lime-400  via-green-800 to-orange-300 leading-10 text-transparent bg-clip-text">
            <span className="underline whitespace-nowrap underline-offset-8  decoration-amber-500">
              Drive
            </span>{" "}
            Tomorrow, Today.
          </span>
        </h1>
        <p className="md:text-2xl p-2 text-xl font-serif text-left">
          Book in Seconds. Drive in Style. Powered by Smart Tech
        </p>
        <button className="cursor-pointer ml-2 p-2 px-3 py-1 rounded-full bg-lime-700 md:text-base text-sm">
          Explore Cars
        </button>
      </div>

      <div className="flex items-center justify-end lg:pl-16">
        <Image
          src="/hero.jpg"
          alt="hero"
          width={500}
          height={500}
          className="h-full w-full outline-none object-cover flex justify-end items-center"
        />
      </div>
    </div>
  );
};
export default Hero;
