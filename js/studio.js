(function () {
  const studio = document.querySelector(".wall") || document.querySelector(".studio");
  if (!studio) return;

  const canDrag = matchMedia("(min-width: 801px) and (pointer: fine)");
  let top = 10;

  studio.querySelectorAll(".piece").forEach((piece) => {
    let startX = 0, startY = 0, offX = 0, offY = 0, moved = false, pointer = null;

    piece.addEventListener("pointerdown", (e) => {
      if (!canDrag.matches || e.button !== 0) return;
      pointer = e.pointerId;
      piece.setPointerCapture(pointer);
      startX = e.clientX - offX;
      startY = e.clientY - offY;
      moved = false;
      piece.style.zIndex = String(++top);
      piece.classList.add("grab");
    });

    piece.addEventListener("pointermove", (e) => {
      if (pointer === null) return;
      const nx = e.clientX - startX;
      const ny = e.clientY - startY;
      if (Math.abs(nx - offX) > 4 || Math.abs(ny - offY) > 4) moved = true;
      offX = nx;
      offY = ny;
      piece.style.translate = `${offX}px ${offY}px`;
    });

    const release = () => {
      if (pointer === null) return;
      try { piece.releasePointerCapture(pointer); } catch (_) {}
      pointer = null;
      piece.classList.remove("grab");
    };

    piece.addEventListener("pointerup", release);
    piece.addEventListener("pointercancel", release);

    // A drag should not also open the lightbox.
    piece.addEventListener("click", (e) => {
      if (moved) {
        e.preventDefault();
        e.stopImmediatePropagation();
        moved = false;
      }
    }, true);
  });
})();
