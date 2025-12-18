import Image from "next/image";

export default function StoreProfilePage() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0">
        <Image
          src="/warungoyako.jpeg"
          alt="Warung Oyako"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
      </div>

      <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[0.1em] drop-shadow-lg">
          WARUNG OYAKO
        </h1>
        <p className="text-sm sm:text-base md:text-lg mt-3 font-light text-white/90">
          Comfort Japaneese Food
        </p>
      </div>
    </section>
  );
}
