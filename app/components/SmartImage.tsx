import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** يُفضل تمرير كلاس يضمن التمدد داخل حاوية relative (مثل absolute inset-0 ...) */
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function isHttpUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

function isDataImage(u: string) {
  return /^data:image\//i.test(u);
}

/**
 * هدفه الأساسي:
 * - الصور المحلية ("/...") نستفيد من next/image
 * - الصور الخارجية أو data URL نعرضها كـ <img> حتى ما ننعلق بـ remotePatterns
 */
export default function SmartImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: Props) {
  if (!src) return null;

  const trimmed = src.trim();

  // data: أو روابط خارجية → <img>
  if (isDataImage(trimmed) || isHttpUrl(trimmed)) {
    return (
      <img
        src={trimmed}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  // محلي داخل public
  if (trimmed.startsWith("/")) {
    return (
      <Image
        src={trimmed}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  // أي شيء غريب → نعرضه كـ img (بدل ما ينكسر)
  return (
    <img
      src={trimmed}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
