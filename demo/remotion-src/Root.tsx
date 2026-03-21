import { Composition } from "remotion";
import { Intro } from "./Intro";
import { EnGeniusAd } from "./EnGenius";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="EnGeniusAd"
        component={EnGeniusAd}
        durationInFrames={900}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
