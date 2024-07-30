import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8 px-72">
      <h1 className="text-4xl font-bold">Welcome to your app</h1>
      <p className="text-lg text-center">
        Get started by editing <code>pages/index.tsx</code>
      </p>
      <p className="text-center"> 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quaerat
        dicta, minima, ut velit culpa porro voluptas officiis totam
        reprehenderit similique distinctio maiores. Repellat, quasi autem rem
        aliquid unde harum. Nesciunt libero ad aliquam blanditiis non maxime
        temporibus labore tempore nemo inventore, rerum modi praesentium
        delectus ut maiores sequi nisi laborum quidem perferendis mollitia
        minus, officia doloremque dolores architecto? Accusamus. Sit error
        aliquam ut nemo delectus dolor reprehenderit ullam ex quasi, libero
        illum veniam voluptates, recusandae dolore deleniti, assumenda dolorem
        magni cumque veritatis aperiam consequatur natus magnam molestiae! Ab,
        debitis! Perspiciatis quo consequatur in at magni assumenda quos,
        numquam iure vel delectus? Neque tempora reiciendis dolores quae veniam,
        saepe incidunt. Ullam asperiores ad eligendi mollitia quae, nisi
        perferendis fugiat aliquid. Libero velit excepturi quasi quis facere
        maxime fuga tenetur ratione itaque, dolor provident nobis minima hic
        aperiam ipsam beatae minus similique ex possimus. Recusandae in optio
        quibusdam dignissimos? Dolorem, delectus.
      </p>
      <Button>
        <code>Send</code>
      </Button>
    </main>
  );
}
