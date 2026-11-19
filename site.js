const classrooms = [
  [8, "Classroom instruction"], [9, "Coaching session"], [38, "Students in class"],
  [45, "Classroom discussion"], [50, "Study hall"],
];
const events = [
  [1, "Instagram video thumbnail"], [30, "Student achievement"],
  [31, "Conversation at the institute"], [32, "Vidyarthi Bhavan celebration"],
  [34, "Interview at the institute"], [35, "At the coaching centre"],
  [36, "Holi celebration"], [43, "Student seminar"], [44, "Student group photo"],
  [46, "Group outside the institute"], [47, "Vidyarthi Bhavan group photo"],
];
const posters = [
  [2, "Odisha Police coaching"], [3, "Odisha Police constable preparation"],
  [4, "Odisha Police batch announcement"], [5, "Odisha Police batch poster"],
  [6, "CLAT preparation"], [7, "Competitive exam coaching"],
  [10, "Odisha Police batch update"], [12, "District police constable preparation"],
  [16, "Odisha Police recruitment announcement"], [33, "CUET preparation"],
  [37, "SSC GD preparation"], [39, "Admission announcement"],
  [41, "Odisha Police exam preparation"], [42, "Odisha Police evening classes"],
  [48, "Government job exam coaching"], [49, "Competitive exam course guide"],
  [51, "Vidyarthi Bhavan information poster"],
];
const resources = [
  [11, "20 angle rules"], [13, "Colourful cities of India"],
  [14, "Indian Constitution"], [15, "Reading practice"], [17, "English grammar"],
  [18, "Types of houses"], [19, "Kitchen verbs"], [20, "Daily English vocabulary"],
  [21, "Types of phobia"], [22, "English prepositions"], [23, "Prepositions illustrated"],
  [24, "The human heart"], [25, "Lung facts"], [26, "Science facts"],
  [27, "Math facts about zero"], [28, "Planet science facts"],
  [29, "Jellyfish facts"], [40, "Indian Constitution emergency provisions"],
];
const photos = new Map();
for (const [type, posts] of Object.entries({
  Classrooms: classrooms,
  Events: events,
  "Exam Posters": posters,
  "Study Resources": resources,
})) {
  for (const [id, title] of posts) {
    photos.set(id, { title, type, src: `assets/post-${String(id).padStart(2, "0")}.webp` });
  }
}
const featured = [8, 47, 6, 43, 38, 44, 37, 11];
const ordered = [...new Set([...featured, ...[...photos.keys()].sort((a, b) => a - b)])].map(id => photos.get(id));

const filters = [...document.querySelectorAll("[data-filter]")];
const grid = document.querySelector("#gallery-grid");
const showMore = document.querySelector("#show-more");
const dialog = document.querySelector("#lightbox");
const image = document.querySelector("#lightbox-image");
const title = document.querySelector("#lightbox-title");
const count = document.querySelector("#photo-count");
const close = document.querySelector("#close-photo");
let current = 0;
let shown = 0;
let matching = ordered;

function updatePhoto() {
  const photo = matching[current];
  image.src = photo.src;
  image.alt = photo.title;
  title.textContent = photo.title;
  count.textContent = `${current + 1} / ${matching.length}`;
}

function shiftPhoto(step) {
  current = (current + step + matching.length) % matching.length;
  updatePhoto();
}

function appendPhotos() {
  const fragment = document.createDocumentFragment();
  const end = Math.min(shown + 8, matching.length);
  for (let index = shown; index < end; index += 1) {
    const photo = matching[index];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.dataset.type = photo.type;
    const thumbnail = document.createElement("img");
    thumbnail.src = photo.src;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = photo.title;
    card.append(thumbnail, label);
    card.addEventListener("click", () => {
      current = index;
      updatePhoto();
      dialog.showModal();
      close.focus();
    });
    fragment.append(card);
  }
  grid.append(fragment);
  shown = end;
  showMore.hidden = shown === matching.length;
}

for (const filter of filters) {
  filter.addEventListener("click", () => {
    for (const button of filters) button.setAttribute("aria-pressed", String(button === filter));
    matching = filter.dataset.filter === "All" ? ordered : ordered.filter(photo => photo.type === filter.dataset.filter);
    grid.replaceChildren();
    shown = 0;
    appendPhotos();
  });
}
showMore.addEventListener("click", () => {
  const firstNewPhoto = shown;
  appendPhotos();
  grid.children[firstNewPhoto]?.focus();
});
close.addEventListener("click", () => dialog.close());
document.querySelector("#prev-photo").addEventListener("click", () => shiftPhoto(-1));
document.querySelector("#next-photo").addEventListener("click", () => shiftPhoto(1));
dialog.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    shiftPhoto(event.key === "ArrowLeft" ? -1 : 1);
  }
});
appendPhotos();

const menu = document.querySelector(".menu");
const nav = document.querySelector("#nav");
menu.addEventListener("click", () => {
  const expanded = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(expanded));
});
nav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }
});
for (const course of document.querySelectorAll("[data-course]")) {
  course.addEventListener("click", () => {
    document.querySelector("#admission-copy").textContent =
      `Message Vidyarthi Bhavan for ${course.dataset.course} batch dates, fees and admission details.`;
  });
}
