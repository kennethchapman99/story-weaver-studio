import { Section } from "./Section";
import grandparentReading from "@/assets/lifestyle-grandparent-reading.jpg";
import familyLaughing from "@/assets/lifestyle-family-laughing.jpg";
import finishedTrilogy from "@/assets/finished-books-trilogy.jpg";
import finishedOpen from "@/assets/finished-book-open.jpg";

export function LifestyleGallery() {
  return (
    <Section
      eyebrow="The finished book"
      title="A real, professionally finished novel they'll keep forever"
      subtitle="Hardcover and paperback editions printed on premium stock with foil-stamped covers — designed to be read aloud, gifted, and treasured."
    >
      <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
        <figure className="md:col-span-7 md:row-span-2 group relative overflow-hidden rounded-3xl shadow-elegant">
          <img
            src={grandparentReading}
            alt="A grandfather and grandchild reading their personalized StoryLoom novel together on a sunlit sofa"
            loading="lazy"
            width={1280}
            height={896}
            className="h-full w-full object-cover transition-spring group-hover:scale-[1.03]"
          />
          <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent p-6 text-primary-foreground">
            <p className="font-display text-lg md:text-xl">"He read it three nights in a row."</p>
            <p className="text-sm opacity-80">— Anna, gifted for Grandpa's 70th</p>
          </figcaption>
        </figure>

        <figure className="md:col-span-5 group relative overflow-hidden rounded-3xl shadow-elegant">
          <img
            src={finishedTrilogy}
            alt="Stack of three finished StoryLoom hardcover novels with gold-foil typography"
            loading="lazy"
            width={1280}
            height={960}
            className="h-full w-full object-cover transition-spring group-hover:scale-[1.03]"
          />
        </figure>

        <div className="md:col-span-5 grid grid-cols-2 gap-5">
          <figure className="group relative overflow-hidden rounded-3xl shadow-elegant">
            <img
              src={familyLaughing}
              alt="Grandmother and granddaughter laughing while reading their custom storybook in a garden"
              loading="lazy"
              width={1280}
              height={896}
              className="h-full w-full object-cover transition-spring group-hover:scale-[1.03]"
            />
          </figure>
          <figure className="group relative overflow-hidden rounded-3xl shadow-elegant">
            <img
              src={finishedOpen}
              alt="Open finished StoryLoom novel showing professional interior typography"
              loading="lazy"
              width={1280}
              height={960}
              className="h-full w-full object-cover transition-spring group-hover:scale-[1.03]"
            />
          </figure>
        </div>
      </div>
    </Section>
  );
}