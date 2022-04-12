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
      break;
    }
    case 2: {
      // Apply new Language
      // Access Language string using event.data.data
      const langTag = event?.data.data?.split("-")[0] ?? event?.data.data;
      this._languageService.switchLanguage(langTag);

      break;
    }
    case 3: {
      // Apply new UserContext
      // Access UserContext Object using event.data.data
      this._acs.changeRole(event?.data.data?.role);

      break;
    }
    case 4: {
      // Apply new SessionData
      // Access SessionData Object using event.data.data

      this.updateConfig(event.data.data);
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
let sessionDescription = urlParams.get('sessionDescription');
let sessionStartDate = urlParams.get('sessionStartDate');

let posterUsername = document.getElementById('poster__username');
let posterSessionTitle = document.getElementById('poster__session_title');
let posterWallpaper = document.getElementById('poster__generic_wallpaper');
let posterSessionDescription = document.getElementById('poster__session_description');

let startDate = new Date("Aug 12, 2022 19:30:00").getTime();

posterUsername.innerHTML = userName;
posterSessionTitle.innerHTML = sessionTitle;
posterSessionDescription.innerHTML = sessionDescription;
posterWallpaper.src = imgUrl;

var countDownFunc = setInterval(function () {
  let now = new Date().getTime();
  let timeLeft = startDate - now;

  var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days + "T ";
  document.getElementById("hours").innerHTML = hours + "s ";
  document.getElementById("mins").innerHTML = minutes + "m ";
  document.getElementById("secs").innerHTML = seconds + "s";
}, 1000);
