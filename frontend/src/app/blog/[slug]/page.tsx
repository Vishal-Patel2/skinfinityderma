import { permanentRedirect } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function BlogSlugRedirect({ params }: Props) {
  // 308 Permanent Redirect to root-level slug (e.g. /ingrown-hair-after-laser-hair-reduction) for Google Rank #1 SEO
  permanentRedirect(`/${params.slug}`);
}
