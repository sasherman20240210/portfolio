const showVideoFallback = (video) => {
  const fallback = video.parentElement.querySelector('.video-fallback');
  if (!fallback) return;
  video.hidden = true;
  fallback.hidden = false;
};

document.querySelectorAll('.comparison-card video').forEach((video) => {
  const sources = video.querySelectorAll('source');
  const fail = () => showVideoFallback(video);

  video.addEventListener('error', fail);
  sources.forEach((source) => source.addEventListener('error', fail));

  window.setTimeout(() => {
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      fail();
    }
  }, 1200);
});
