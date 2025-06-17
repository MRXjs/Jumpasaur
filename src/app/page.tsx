'use client'
import dynamic from 'next/dynamic'
// @ts-ignore
import ChromeDinoGame from 'react-chrome-dino'

const PoseDetector = dynamic(() => import('@/components/PoseDetector'), {
  ssr: false,
})

export default function Home() {
  const handleJump = () => {
    console.log('Dino should jump now! 🦖⬆️')

    const event = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      which: 32,
      bubbles: true,
    })

    document.dispatchEvent(event)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-lime-400 drop-shadow-lg animate-bounce text-white">
        Dino Jump
      </h1>

      <div className="w-full h-[210px] bg-black rounded-md overflow-hidden">
        <ChromeDinoGame />
      </div>

      <p className="mt-6 text-center text-sm text-white">
        Jump in front of your webcam to control the dinosaur.
        <br />
        It’s fitness meets fun 💪🎮
      </p>

      <PoseDetector onJump={handleJump} />
    </main>
  )
}
