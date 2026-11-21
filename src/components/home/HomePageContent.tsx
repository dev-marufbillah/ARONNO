import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Gift, ShieldCheck, Truck } from "lucide-react";
import MotionReveal from "@/components/ui/MotionReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { NewsletterForm } from "@/components/forms/StoreForms";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { heroImage, socialGallery, testimonials } from "@/lib/demo-data";
import type { SiteSettings } from "@/lib/store-settings";

export default function HomePageContent({
  categories,
  newArrivals,
  bestSellers,
  settings,
}: {
  categories: Array<{ id: string; name: string; slug: string; imageUrl: string | null; description: string | null }>;
  newArrivals: Array<any>;
  bestSellers: Array<any>;
  settings: SiteSettings;
}) {
  return (
    <>
      <WhatsAppButton phoneNumber={settings.whatsappNumber} />
      <section className="relative min-h-[620px] overflow-hidden bg-black-deep">
        <Image src={settings.heroImage || heroImage} alt="Luxury editorial hero" fill priority unoptimized className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black-deep via-black-deep/70 to-black-deep/20" />
        <Container className="relative z-10 flex min-h-[620px] items-center py-24">
          <MotionReveal className="max-w-2xl">
            <p className="mb-6 text-[11px] uppercase tracking-[0.25em] text-gold">{settings.heroEyebrow}</p>
            <h1 className="whitespace-pre-line text-balance text-[3rem] leading-[0.95] text-ivory md:text-[5.5rem]">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-ivory/70 md:text-lg">
              {settings.heroDescription}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={settings.heroPrimaryHref}>{settings.heroPrimaryLabel}</ButtonLink>
              <ButtonLink href={settings.heroSecondaryHref} variant="dark">
                {settings.heroSecondaryLabel}
              </ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-24 md:py-[96px]">
        <Container>
          <MotionReveal>
            <SectionHeading title="Explore The Collection" />
          </MotionReveal>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categories.slice(0, 5).map((category, index) => (
              <MotionReveal key={category.id} delay={index * 0.06}>
                <Link href={`/category/${category.slug}`} className="group relative block aspect-[0.88] overflow-hidden bg-[#f5f1e8]">
                  <Image
                    src={category.imageUrl ?? heroImage}
                    alt={category.name}
                    width={800}
                    height={960}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-deep/70 via-black-deep/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="text-xl uppercase tracking-[0.12em]">{category.name}</h3>
                  </div>
                </Link>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24 md:pb-[96px]">
        <Container>
          <MotionReveal>
            <SectionHeading
              title="New Arrivals"
              action={<Link href="/new-arrivals" className="text-sm uppercase tracking-[0.16em] text-black/55">View All</Link>}
            />
          </MotionReveal>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {newArrivals.slice(0, 4).map((product: any, index: number) => (
              <MotionReveal key={product.id} delay={index * 0.06}>
                <ProductCard product={product} />
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-black-deep py-20 text-ivory">
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden">
            <Image src={settings.signatureImage} alt="Signature collection" width={1200} height={900} unoptimized className="h-full w-full object-cover" />
          </div>
          <MotionReveal className="max-w-xl lg:px-8">
            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-gold">{settings.signatureEyebrow}</p>
            <h2 className="text-4xl leading-tight md:text-5xl">{settings.signatureTitle}</h2>
            <p className="mt-5 text-base leading-8 text-ivory/70">
              {settings.signatureDescription}
            </p>
            <div className="mt-8">
              <ButtonLink href="/shop" variant="dark">Explore Signature Collection</ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-24 md:py-[96px]">
        <Container>
          <MotionReveal>
            <SectionHeading
              title="The ARONNO Edit"
              action={<Link href="/shop?sort=popular" className="text-sm uppercase tracking-[0.16em] text-black/55">View All</Link>}
            />
          </MotionReveal>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {bestSellers.slice(0, 4).map((product: any, index: number) => (
              <MotionReveal key={product.id} delay={index * 0.06}>
                <ProductCard product={product} showRating />
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/10 py-14">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Authentic Products",
                text: "Every piece is carefully selected for quality and authenticity.",
                icon: BadgeCheck,
              },
              {
                title: "Premium Packaging",
                text: "Every order arrives beautifully prepared for a memorable experience.",
                icon: Gift,
              },
              {
                title: "Secure Delivery",
                text: "Reliable and secure delivery across Bangladesh.",
                icon: Truck,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <MotionReveal key={item.title} delay={index * 0.08} className="flex gap-4">
                  <div className="mt-1 text-gold"><Icon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <h3 className="text-lg uppercase tracking-[0.12em] text-black-deep">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-black/60">{item.text}</p>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-[96px]">
        <Container className="grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden">
            <Image src={settings.storyImage} alt="ARONNO brand story" width={1200} height={1000} unoptimized className="h-full w-full object-cover" />
          </div>
          <MotionReveal className="max-w-xl lg:px-8">
            <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-gold">{settings.storyEyebrow}</p>
            <h2 className="text-4xl leading-tight text-black-deep md:text-5xl">{settings.storyTitle}</h2>
            <p className="mt-5 text-base leading-8 text-black/65">
              {settings.storyDescription}
            </p>
            <div className="mt-8">
              <ButtonLink href="/about" variant="secondary">Our Story</ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-24 text-white">
        <Image src={settings.giftImage} alt="Gift collection" fill unoptimized className="object-cover" />
        <div className="absolute inset-0 bg-black-deep/55" />
        <Container className="relative z-10">
          <MotionReveal className="max-w-2xl py-8">
            <h2 className="text-4xl leading-tight md:text-5xl">{settings.giftTitle}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
              {settings.giftDescription}
            </p>
            <div className="mt-8">
              <ButtonLink href="/category/gifts" variant="dark">Explore Gifts</ButtonLink>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-24 md:py-[96px]">
        <Container>
          <MotionReveal>
            <SectionHeading title="The ARONNO Experience" />
          </MotionReveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <MotionReveal key={testimonial.name} delay={index * 0.08}>
                <article className="border border-black/10 bg-[#fbfaf7] p-8">
                  <div className="mb-4 flex text-gold">★★★★★</div>
                  <p className="text-base leading-8 text-black/65">&ldquo;{testimonial.review}&rdquo;</p>
                  <p className="mt-6 text-sm uppercase tracking-[0.16em] text-black-deep">{testimonial.name}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24 md:pb-[96px]">
        <Container>
          <MotionReveal>
            <SectionHeading title="Follow The ARONNO World" />
          </MotionReveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {socialGallery.map((image, index) => (
              <MotionReveal key={image} delay={index * 0.04}>
                <div className="group overflow-hidden">
                  <Image src={image} alt="ARONNO social gallery" width={500} height={500} className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                </div>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-black-deep py-24 text-ivory">
        <Container>
          <MotionReveal className="text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Newsletter</p>
            <h2 className="mt-4 text-4xl md:text-5xl">{settings.newsletterTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ivory/70">
              {settings.newsletterDescription}
            </p>
          </MotionReveal>
          <NewsletterForm />
        </Container>
      </section>
    </>
  );
}