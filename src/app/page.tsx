'use client'
import PoseDetector from '@/components/PoseDetector'
import ChromeDinoGame from 'react-chrome-dino'

export default function Home() {
  const handleJump = () => {
    console.log('Dino should jump now! 🦖⬆️')
  }

  return (
    <main>
      <ChromeDinoGame />
      <PoseDetector onJump={handleJump} />
    </main>
  )
}
