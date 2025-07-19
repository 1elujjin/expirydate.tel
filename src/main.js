import {data} from "./data";
const container = document.getElementById("link-container");
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("close-sidebar");

/* ------------------------------ sidebar logic ----------------------------- */

menuToggle.addEventListener("click", () => {
    sidebar.classList.remove("translate-x-full");
    sidebar.classList.add("translate-x-0");
});

closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add("translate-x-full");
});

/* ------------------------------ hover image  ----------------------------- */

data.forEach((item, index) => {
    const wrapper = document.createElement("span");
    wrapper.className = "inline align-middle  text-[2.33vw]";

    // Normal <a> tag
    const a = document.createElement("a");
    a.href = item.url;
    a.textContent = item.text;
    a.dataset.img = item.img;
    a.className = `hover-target text-[#ffffffcc]  duration-700 hover:text-[#4D4D4D] transition-all ease-in-out hidden lg:inline ${item.className}`;

    // --- Small screen card ---
    const smCard = document.createElement("a");
    smCard.className = "lg:hidden mb-10 block";
    smCard.href = item.url;

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = "Preview";
    img.className = "w-full mb-4";

    const category = document.createElement("div");
    category.textContent = item.category;
    category.className = "text-xs  text-center tracking-wide text-white/40 mb-4";

    const title = document.createElement("div");
    title.textContent = item.text;
    title.className = "text-2xl text-center ";

    const subtitle = document.createElement("div");
    subtitle.textContent = item.subtitle;
    subtitle.className = "text-sm text-center tracking-wide text-white/40 mt-4";

    smCard.appendChild(img);
    smCard.appendChild(category);
    smCard.appendChild(title);
    smCard.appendChild(subtitle);

    wrapper.appendChild(a);
    wrapper.appendChild(smCard);
    container.appendChild(wrapper);

    if (index !== data.length - 1) {
        const dot = document.createElement("span");
        dot.className = "size-1.5 rounded-full bg-white hidden lg:inline-block  mx-4"; 
        container.appendChild(dot);
    }
});

// Hover Logic
if (window.innerWidth >= 1024) {
    const image = document.getElementById("hover-image");
    document.querySelectorAll(".hover-target").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            image.src = el.dataset.img;
            image.classList.remove("hidden");
        });

        el.addEventListener("mousemove", (e) => {
            const padding = 16;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            image.style.visibility = "hidden";
            image.style.left = "0px";
            image.style.top = "0px";
            image.style.maxWidth = "none";
            image.style.maxHeight = "none";

            requestAnimationFrame(() => {
                const imgWidth = image.naturalWidth;
                const imgHeight = image.naturalHeight;

                let displayWidth = imgWidth;
                let displayHeight = imgHeight;

                const maxW = 400;
                const maxH = 800;

                if (imgWidth > maxW) {
                    const scale = maxW / imgWidth;
                    displayWidth = maxW;
                    displayHeight = imgHeight * scale;
                }

                if (displayHeight > maxH) {
                    const scale = maxH / displayHeight;
                    displayHeight = maxH;
                    displayWidth = displayWidth * scale;
                }

                let left = e.clientX + padding;
                let top = e.clientY + padding;

                if (left + displayWidth > vw) {
                    left = e.clientX - displayWidth - padding;
                }

                if (top + displayHeight > vh) {
                    top = e.clientY - displayHeight - padding;
                }

                image.style.width = `${displayWidth}px`;
                image.style.height = `${displayHeight}px`;
                image.style.left = `${left}px`;
                image.style.top = `${top}px`;
                image.style.visibility = "visible";
            });
        });

        el.addEventListener("mouseleave", () => {
            image.classList.add("hidden");
            image.style.width = "";
            image.style.height = "";
        });
    });
}

/* ------------------------------ clickable image container  ----------------------------- */
