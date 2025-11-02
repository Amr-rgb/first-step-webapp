const PreviewVideo = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="overflow-hidden flex rounded-5xl border border-secondary-burgundy lg:mx-10">
        <iframe
          src="https://app.storylane.io/share/ykbuf38vj3mp"
          className="w-full aspect-video"
          allow="fullscreen"
          allowFullScreen
          style={{ minHeight: "500px" }}
        />
      </div>
    </section>
  );
};

export default PreviewVideo;
