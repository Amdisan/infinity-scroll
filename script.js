// Unsplash API
const apiKey = "IWGi7xnJ2Veg-vdunOXlugksL3gEwXzbuPLTdJKrwQM";

let count = 5;

let unsplashUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

let photosArray = [];
const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");
let targetImg = null;
let initialStart = true;

// get photos from API
async function getPhotos() {
  try {
    if (!initialStart) {
      count = 10;
      unsplashUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;
    }
    const res = await fetch(unsplashUrl);
    if (!res.ok) {
      let message = "";
      for (const pair of res.headers.entries()) {
        message += `${pair[0]} ${pair[1]}` + ". ";
      }
      throw new Error(`Status: ${res.status}. Ratelimit: ${message}`);
    }

    const data = await res.json();

    if (data && data.length !== 0) {
      const newPhotosArray = data.map(
        (photo, i) =>
          `<a href=${photo.links.html} target="_blank">
          <img src=${photo.urls.regular}
          alt=${photo.alt_description}
          title=${photo.alt_description}
          id=photo${photosArray.length + i + 1}>
        </a>
        `
      );
      photosArray = photosArray.concat(newPhotosArray);
    } else {
      throw new Error("Problems with photo array");
    }
  } catch (error) {
    console.log(`Something wrong: ${error}`);
  }
}

async function displayPhotos() {
  await getPhotos();
  imageContainer.innerHTML = photosArray.join("");
  targetImg = document.querySelector(`#photo${photosArray.length - 1}`);
}

// Starting App

async function App() {
  if (targetImg) {
    observer.unobserve(targetImg);
  }
  await displayPhotos();

  if (targetImg) {
    targetImg.onload = () => {
      initialStart = false;
      loader.hidden = true;
      observer.observe(targetImg);
    };
  }
}

const observerOptions = {
  root: null,
  threshold: 0.1,
};

function checkIntersection(entries) {
  if (entries[0].isIntersecting) {
    App();
  }
}

const observer = new IntersectionObserver(checkIntersection, observerOptions);

App();
