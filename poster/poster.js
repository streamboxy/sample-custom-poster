var coreURL = getOrigin();

// Provide the currently used Streamboxy Stage URL origin, if a custom domain is used, use the custom domains URL origin
// Streamboxy Core attaches the calling CoreURL (e.g. https://stage.streamboxy.com) as search param to your provided URL
function getOrigin() {
  var params = new URL(document.location).searchParams;
  var encodedOrigin = params.get("origin");
  var origin = decodeURIComponent(encodedOrigin);

  return origin;
}

var noticeEvent = {
  type: 0,
};

window.parent.postMessage(noticeEvent, coreURL);

window.addEventListener("message", (event) => {
  if (event.origin !== coreURL) {
    throw new Error("Will not process message by unknown origin.");
  }

  switch (event.data.type) {
    case 0: {
      break;
    }
    case 1: {
      // Apply new Styling
      // Access SessionStyle Object using event.data.data
      //    this._styleService.update(event.data.data);
      document.documentElement.style.setProperty(
        "--accent-color",
        `${event.data.data.accentColor}`
      );
      document.documentElement.style.setProperty(
        "--background-color",
        `${event.data.data.backgroundColor}`
      );
      document.documentElement.style.setProperty(
        "--text-color",
        `${event.data.data.textColor}`
      );
      document.documentElement.style.setProperty(
        "--canvas-color",
        `${event.data.data.canvasColor}`
      );

      if(event.data.data.textFontUrl || event.data.data.titleFontUrl){
        setFontsOnRoot(event.data.data.titleFontUrl, event.data.data.textFontUrl);
      }
      break;
    }
    case 2: {
      // Apply new Language
      // Access Language string using event.data.data
      const langTag = event?.data.data?.split("-")[0] ?? event?.data.data;
      setLocale(langTag);
      break;
    }
    case 3: {
      // Apply new UserContext
      // Access UserContext Object using event.data.data
      //this._acs.changeRole(event?.data.data?.role);

      break;
    }
    case 4: {
      // Apply new SessionData
      // Access SessionData Object using event.data.data
      break;
    }
    default: {
      break;
    }
  }
});

let urlParams = new URLSearchParams(window.location.search);
let userName = urlParams.get('userName');
let imgUrl = urlParams.get('imgUrl');
let sessionTitle = urlParams.get('sessionTitle');
let sessionStartDate = urlParams.get('sessionStartDate');

let posterUsername = document.getElementById('poster__username');
let posterSessionTitle = document.getElementById('poster__session_title');
let posterWallpaper = document.getElementById('poster__generic_wallpaper');

let date = new Date(sessionStartDate); 
date.getTime();

posterUsername.innerHTML = userName;
posterSessionTitle.innerHTML = sessionTitle;

if(imgUrl != null ){
  posterWallpaper.src = imgUrl;
}
else {
  posterWallpaper.style.display = 'none'
}

/// Countdown

var countDownFunc = setInterval(function () {
  let now = new Date().getTime();
  let timeLeft = date - now;

  var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("mins").innerHTML = minutes;
  document.getElementById("secs").innerHTML = seconds;


  if (timeLeft < 0) {
    clearInterval(countDownFunc);
    document.getElementById("days").innerHTML = "0"
    document.getElementById("hours").innerHTML = "0" 
    document.getElementById("mins").innerHTML = "0"
    document.getElementById("secs").innerHTML = "0"
  }
}, 1000);


//// Style

function setFontsOnRoot(title, text){
  const font = `
  @font-face {
    font-family: 'Standard';
    src: url('${text}') format('woff2');
    font-weight: 300;
  }

  @font-face {
    font-family: 'Standard';
    src: url('${title}') format('woff2');
    font-weight: 600,700,800,900;
  }`;

  const node = document.createElement('style');
  node.innerHTML = font;
  document.body.appendChild(node);
};



/// Language

let locale = "de";

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = 
    await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}
// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`assets/i18n/${newLocale}.json`);
  return await response.json();
}
// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
  document
    .querySelectorAll("[data-i18n-key]")
    .forEach(translateElement);
}


function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerText = translation;
}
