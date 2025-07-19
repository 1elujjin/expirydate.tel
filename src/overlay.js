import VanillaTilt from "vanilla-tilt";
import { data } from "./data";

const overlay = document.getElementById("overlay")

let imageId = 0;
const minImages = 5;
const maxImages = 6;
let isFadingOut = false;
const usedImages = new Set();

// Disable scroll when overlay is active
document.body.style.overflow = "hidden";

// Spawn a single image
function spawnImage() {
    if (!overlay || isFadingOut) return;

    const currentImages = overlay.querySelectorAll("img.intro-img").length;
    if (currentImages >= maxImages) return;

    const availableData = data.filter((d) => !usedImages.has(d.img));
    if (availableData.length === 0) return;

    const imgSrc = availableData[Math.floor(Math.random() * availableData.length)];
    const img = document.createElement("img");

    imageId++;
    img.setAttribute("data-id", imageId);
    img.setAttribute("data-tilt", "");
    img.setAttribute("data-tilt-reverse", "true");
    img.src = imgSrc.img;
    img.alt = "Intro Image";

    img.className = `
      intro-img 
      fixed z-10 
      shadow-2xl 
      max-w-[550px] w-[30vw] md:w-[550px] 
      will-change-transform 
      transform-gpu 
      transition-transform duration-300 ease-out
    `
        .replace(/\s+/g, " ")
        .trim();

    img.style.transform = "translateZ(0)";

   const imgWidth = window.innerWidth > 768 ? 550 : window.innerWidth * 0.3;
   const overflowAmount = imgWidth * 0.15;

   const minLeft = -overflowAmount;
   const maxLeft = window.innerWidth - imgWidth + overflowAmount;

   const minTop = -overflowAmount;
   const maxTop = window.innerHeight - imgWidth + overflowAmount;

   const left = Math.random() * (maxLeft - minLeft) + minLeft;
   const top = Math.random() * (maxTop - minTop) + minTop;


    img.style.left = `${left}px`;
    img.style.top = `${top}px`;

    overlay.appendChild(img);

    // Add custom hover flag
    img.isHovered = false;

    img.addEventListener("mouseenter", () => {
        img.isHovered = true;
        img.style.zIndex = "9999"; // Top layer
    });

    img.addEventListener("mouseleave", () => {
        img.isHovered = false;
        img.style.zIndex = ""; // Reset
    });

    // Track usage
    usedImages.add(imgSrc.img);

    // Tilt AFTER DOM attached
    VanillaTilt.init(img, {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 1,
        scale: 1.05,
    });

    // Removal — now hover-aware!
    const lifetime = 4500 + Math.random() * 1000;
    setTimeout(() => {
        // Double-check hover state *when timeout runs*
        if (!isFadingOut && img.parentElement && !img.isHovered) {
            img.remove();
            usedImages.delete(imgSrc.img);
        }
    }, lifetime);
}


// Ensure minimum number of images
function ensureMinCount() {
    if (isFadingOut) return;

    let current = overlay.querySelectorAll("img.intro-img").length;
    while (current < minImages) {
        spawnImage();
        current++;
    }
}

// Maybe replace one image
function maybeReplace() {
    if (isFadingOut) return;

    const images = overlay.querySelectorAll("img.intro-img");
    if (images.length === maxImages) {
        const target = images[Math.floor(Math.random() * images.length)];
        if (target && target.parentElement) {
            const imgSrc = target.src.split("/").pop(); // Just filename
            target.remove();
            usedImages.delete(`/` + imgSrc); // Free it
            setTimeout(() => {
                spawnImage();
            }, 300 + Math.random() * 400);
        }
    }
}

// Initial spawn
(function init() {
    for (let i = 0; i < maxImages; i++) {
        setTimeout(() => spawnImage(), i * 300);
    }
})();

// Intervals
setInterval(() => ensureMinCount(), 400);
setInterval(() => maybeReplace(), 2500);

// Fade out on click
overlay.addEventListener("click", () => {
    if (isFadingOut) return;
    isFadingOut = true;

    overlay.classList.remove("opacity-100");
    overlay.classList.add("opacity-0", "pointer-events-none");

    setTimeout(() => {
        overlay.style.display = "none";
        document.body.style.overflow = "";
    }, 800);
});
