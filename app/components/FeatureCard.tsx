import Image from "next/image";
import Link from "next/link";
import { testsDetails } from "../lib/content";

type FeatureCardProps = {
  title: string;
  text: string;
  subText?:string;
  image: string;
  href?: string;
};

function CardBody({ title, text, image ,subText }: Omit<FeatureCardProps, "href">) {
  return (
    <div className="min-h-[425px] group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-base font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">{subText}</p>
      </div>
    </div>
  );
}

export default function FeatureCard({
  title,
  text,
  subText,
  image,
  href,
}:FeatureCardProps ) {

 const content = <CardBody title={title} text={text} image={image} subText={subText} />;

  if (!href) return content;

  return <Link href={href}>{content}</Link>;
}
