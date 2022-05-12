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
      break;
    }
    case 2: {
      // Apply new Language
      // Access Language string using event.data.data
      const langTag = event?.data.data?.split("-")[0] ?? event?.data.data;
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

let date = new Date(sessionStartDate); 
date.getTime();

posterUsername.innerHTML = userName;
posterSessionTitle.innerHTML = sessionTitle;
posterSessionDescription.innerHTML = sessionDescription;

if(imgUrl != null ){
  posterWallpaper.src = imgUrl;
}

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

}, 1000);

if (timeLeft < 0) {
  clearInterval(countDownFunc);
  document.getElementById("days").innerHTML = "0"
  document.getElementById("hours").innerHTML = "0" 
  document.getElementById("mins").innerHTML = "0"
  document.getElementById("secs").innerHTML = "0"
}