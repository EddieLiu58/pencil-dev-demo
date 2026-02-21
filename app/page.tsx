import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

import { KitamuraHome } from "@/components/kitamura-home";

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function Home() {
  return (
    <KitamuraHome
      serifClassName={notoSerif.className}
      sansClassName={notoSans.className}
    />
  );
}
