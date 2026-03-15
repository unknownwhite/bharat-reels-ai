import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Video as RemotionVideo,
  Audio,
  interpolate
} from "remotion";

export const Video = ({ hook, script, bg, voiceUrl, captions = [] }: any) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = (frame / fps) * 1000;

  const activeCaption = captions.find(
    (c: any) => currentTime >= c.start && currentTime <= c.end
  );

  const words = activeCaption?.text?.split(" ") || [];

  return (
    <AbsoluteFill>

      {/* Voice narration */}
      {voiceUrl && <Audio src={voiceUrl} />}

      {/* Background video */}
      {bg && (
        <RemotionVideo
          src={bg}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      )}

      {/* Cinematic overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
        }}
      />

      {/* Hook intro */}
      {frame < 40 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 100,
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              textShadow: "0px 0px 30px rgba(0,0,0,0.8)"
            }}
          >
            {hook}
          </div>
        </AbsoluteFill>
      )}

      {/* Viral captions */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 220
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900
          }}
        >
          {words.map((word: string, i: number) => {

            const scale = interpolate(
              frame % 8,
              [0, 4, 8],
              [1, 1.25, 1]
            );

            const highlight = i === 0;

            return (
              <span
                key={i}
                style={{
                  marginRight: 14,
                  color: highlight ? "#FFD400" : "white",
                  textTransform: highlight ? "uppercase" : "none",
                  display: "inline-block",
                  transform: `scale(${highlight ? scale : 1})`,
                  textShadow: "0px 0px 20px rgba(0,0,0,0.9)"
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};