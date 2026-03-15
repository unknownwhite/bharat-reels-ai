import { Composition } from "remotion";
import { Video } from "./Video";

export const RemotionRoot = () => {

  return (
    <>
      <Composition
        id="ShortVideo"
        component={Video}
        durationInFrames={300} // 10 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: "Example hook",
          script: "Example script",
          bg: "/videos/bg.mp4"
        }}
      />
    </>
  );
};