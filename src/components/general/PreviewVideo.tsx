import MuxPlayer from "@mux/mux-player-react";
import { createBlurUp } from "@mux/blurup";

const options = {};
const muxPlaybackId = "01J3iEgcr7zrxGh1uQt6Wagp6M0286YVenlg8NgKKUMZQ";

const PreviewVideo = async () => {
  const { blurDataURL, aspectRatio } = await createBlurUp(
    muxPlaybackId,
    options
  );

  return (
    <section className="container mx-auto px-4">
      <div
        className="overflow-hidden flex rounded-5xl border border-secondary-burgundy lg:mx-10"
        style={{ aspectRatio }}
      >
        <MuxPlayer
          playbackId={muxPlaybackId}
          metadata={{
            video_id: "6YPfNrCnz4e57KTXAqAob2pW4XsauSWkYEcy5T8vcjk",
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

export default PreviewVideo;
