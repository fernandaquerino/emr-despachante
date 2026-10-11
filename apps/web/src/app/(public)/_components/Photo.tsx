import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@emr/ui";
import { publicPhotos, type PublicPhotoKey } from "./lib/photos";

export interface PhotoProps {
  name: PublicPhotoKey;
  /** Preenche o container posicionado em vez de ocupar o próprio espaço. */
  fill?: boolean;
  /** Foco do recorte quando `fill` corta a imagem (ex.: "60% 50%"). */
  objectPosition?: string;
  /** `true` só na foto da dobra — é o provável LCP da página. */
  priority?: boolean;
  /** Dica de layout para o `next/image` escolher a resolução certa. */
  sizes?: string;
  className?: string;
}

/**
 * Fotografia da área pública, com estado provisório explícito.
 *
 * Enquanto o arquivo não existe (`available: false` em `lib/photos.ts`), em
 * vez de uma imagem quebrada ou de uma ilustração vetorial improvisada, sai um
 * bloco neutro com o briefing da foto que falta. É feio de propósito: foto
 * faltando precisa ser visível em review, não disfarçada.
 */
export function Photo({ name, fill, objectPosition, priority, sizes, className }: PhotoProps) {
  const photo = publicPhotos[name];
  const ratio = fill ? undefined : { aspectRatio: `${photo.width} / ${photo.height}` };

  if (!photo.available) {
    return (
      <div
        role="img"
        aria-label={`Espaço reservado para fotografia: ${photo.alt}`}
        style={ratio}
        className={cn(
          "flex w-full flex-col justify-end gap-2 rounded-xl border border-dashed border-border-strong bg-bg-subtle p-6",
          fill && "absolute inset-0 h-full",
          className,
        )}
      >
        <Camera aria-hidden="true" className="h-6 w-6 text-text-muted" />
        <p className="text-label font-semibold uppercase tracking-wide text-text-muted">
          Fotografia pendente
        </p>
        <p className="max-w-[44ch] text-body text-text-secondary-strong">{photo.briefing}</p>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectPosition }}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      priority={priority}
      sizes={sizes}
      style={ratio}
      className={cn("w-full rounded-xl object-cover", className)}
    />
  );
}
