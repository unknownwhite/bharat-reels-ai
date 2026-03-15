import { useCurrentFrame } from "remotion"

export const Captions = ({ captions }) => {

  const frame = useCurrentFrame()
  const fps = 30

  const currentTime = (frame / fps) * 1000

  const currentCaption = captions.find(
    (c) => currentTime >= c.start && currentTime <= c.end
  )

  if (!currentCaption) return null

  const words = currentCaption.text.split(" ")

  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        width: "100%",
        textAlign: "center",
        fontSize: 70,
        fontWeight: "bold",
        color: "white",
        textShadow: "0px 0px 20px rgba(0,0,0,0.8)"
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            marginRight: 12,
            color: i === 0 ? "#FFD000" : "white"
          }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}