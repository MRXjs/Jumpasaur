'use client'
import { useEffect, useRef, useState } from 'react'
import { Pose } from '@mediapipe/pose'

type Props = {
  onJump: () => void
}

export default function PoseDetector({ onJump }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [previousHipY, setPreviousHipY] = useState<number | null>(null)

  useEffect(() => {
    const init = async () => {
      const { Camera } = await import('@mediapipe/camera_utils')

      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      })

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      pose.onResults((results) => {
        if (!results.poseLandmarks) return

        const leftHip = results.poseLandmarks[23]
        const hipY = leftHip.y

        if (previousHipY !== null) {
          const delta = previousHipY - hipY
          if (delta > 0.1) {
            console.log('Jump detected!')
            onJump()
          }
        }

        setPreviousHipY(hipY)
      })

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await pose.send({ image: videoRef.current as HTMLVideoElement })
          },
          width: 640,
          height: 480,
        })

        camera.start()
      }
    }

    init()
  }, [previousHipY, onJump])

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
    </div>
  )
}
