document.addEventListener("DOMContentLoaded", function () {
  var zoomImgs = Array.from(document.querySelectorAll(".img-zoomable"));
  var modal = document.getElementById("img-modal");
  var modalImg = document.getElementById("modal-img");
  var caption = document.getElementById("modal-caption");
  var closeBtn = document.getElementById("close-modal");
  var arrowLeft = document.getElementById("modal-arrow-left");
  var arrowRight = document.getElementById("modal-arrow-right");
  var currentIdx = 0;

  function showModal(idx) {
    var img = zoomImgs[idx];
    if (!img) return;
    modal.style.display = "flex";
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    caption.textContent = img.alt || "";
    currentIdx = idx;
    arrowLeft.style.display = idx > 0 ? "flex" : "none";
    arrowRight.style.display = idx < zoomImgs.length - 1 ? "flex" : "none";
  }

  zoomImgs.forEach(function (img, idx) {
    img.addEventListener("click", function () {
      showModal(idx);
    });
  });

  closeBtn.onclick = function () {
    modal.style.display = "none";
    modalImg.src = "";
    caption.textContent = "";
  };

  arrowLeft.onclick = function (e) {
    e.stopPropagation();
    if (currentIdx > 0) {
      showModal(currentIdx - 1);
    }
  };
  arrowRight.onclick = function (e) {
    e.stopPropagation();
    if (currentIdx < zoomImgs.length - 1) {
      showModal(currentIdx + 1);
    }
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
      caption.textContent = "";
    }
  };

  document.addEventListener("keydown", function (e) {
    if (modal.style.display === "flex") {
      if (e.key === "ArrowLeft" && currentIdx > 0) {
        showModal(currentIdx - 1);
      } else if (e.key === "ArrowRight" && currentIdx < zoomImgs.length - 1) {
        showModal(currentIdx + 1);
      } else if (e.key === "Escape") {
        modal.style.display = "none";
        modalImg.src = "";
        caption.textContent = "";
      }
    }
  });
});
