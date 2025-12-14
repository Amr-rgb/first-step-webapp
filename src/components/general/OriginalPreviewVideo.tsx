import MuxPlayer from "@mux/mux-player-react";
import { createBlurUp } from "@mux/blurup";

const options = {};
const muxPlaybackId = "T8It02oFFSo401wcc00tTcn4WCbRW3CjO1qE0202ZyuBexLk";

const OriginalPreviewVideo = async () => {
  let blurDataURL = "";
  let aspectRatio = "16/9";

  try {
    const blurData = await createBlurUp(muxPlaybackId, options);
    blurDataURL = blurData.blurDataURL;
    aspectRatio = blurData.aspectRatio.toString();
  } catch (error) {
    console.error("Error creating blur placeholder:", error);
    // Continue with default values
  }

  return (
    <section className="container mx-auto px-4">
      <div
        className="overflow-hidden flex rounded-5xl border border-secondary-burgundy lg:mx-10"
        style={{ aspectRatio }}
      >
        <MuxPlayer
          playbackId={muxPlaybackId}
          metadata={{
            video_id: "5CtgfRTknowfMGd00gzeKiPIEhcXJ02DJppj9Doy1vUNk",
            video_title: "First Step Preview",
            viewer_user_id: "user-id-007",
          }}
          accentColor="#D9534F"
          placeholder={blurDataURL}
          style={{ aspectRatio }}
        />
      </div>
    </section>
  );
};

export default OriginalPreviewVideo;
