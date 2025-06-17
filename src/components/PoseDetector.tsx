'use client'
import { useEffect, useRef } from 'react'

type Props = {
  onJump: () => void
}

export default function PoseDetector({ onJump }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousHipYRef = useRef<number | null>(null)

  useEffect(() => {
    const init = async () => {
      const { Pose } = await import('@mediapipe/pose')
      const { Camera } = await import('@mediapipe/camera_utils')

      const pose = new Pose({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      })

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      pose.onResults((results: any) => {
        if (!results.poseLandmarks) return

        const leftHip = results.poseLandmarks[23]
        const hipY = leftHip.y

        const prevY = previousHipYRef.current
        if (prevY !== null) {
          const delta = prevY - hipY
          if (delta > 0.1) {
            console.log('Jump detected! 🦘')
            onJump()
          }
        }

        previousHipYRef.current = hipY
      })

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await pose.send({ image: videoRef.current! })
          },
          width: 640,
          height: 480,
        })

        camera.start()
      }
    }

    init()
  }, [onJump]) // ✅ only trigger once

  return (
    <div className=" ">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className=" w-[580px] h-[280px] border-[3px] border-lime-400 rounded-xl shadow-[0_4px_20px_rgba(0,255,0,0.4)] backdrop-blur-sm"
      />
    </div>
  )
}
