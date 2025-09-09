import { Button } from '@/components/ui/button'
import React from 'react'

export default function reportsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-amber-50 p-8">
      <h1 className="text-4xl font-bold">Página de Reportes</h1>
      <p className="text-center md:w-[50%]">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quaerat
        dicta, minima, ut velit culpa porro voluptas officiis totam
        reprehenderit similique distinctio maiores. Repellat, quasi autem rem
        aliquid unde harum. Nesciunt libero ad aliquam blanditiis non maxime
        temporibus labore tempore nemo inventore, rerum modi praesentium
        delectus ut maiores sequi nisi laborum quidem perferendis mollitia
        minus, officia doloremque dolores architecto? Accusamus. Sit error
        aliquam ut nemo delectus dolor reprehenderit ullam ex quasi, libero
      </p>
      <Button>
        <code>Enviar</code>
      </Button>
    </div>
  )
}
