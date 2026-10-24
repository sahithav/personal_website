(function () {
  const dialog = document.querySelector(".lightbox");
  if (!dialog) return;

  const image = dialog.querySelector("img");
  const close = dialog.querySelector(".lightbox-close");

  const openZoom = (button) => {
    const source = button && button.querySelector("img");
    if (!source) return;
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    if (!dialog.open) dialog.showModal();
  };

  document.querySelectorAll(".zoom").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openZoom(button);
    });
  });

  // Dragging a painting captures the pointer, so the click lands on the
  // piece instead of the button. Open the same enlarged view either way.
  document.querySelectorAll(".piece").forEach((piece) => {
    piece.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      openZoom(piece.querySelector(".zoom"));
    });
  });

  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
