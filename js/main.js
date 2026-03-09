"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;
var loadStartTime = null;
var lastNeededUpdate = null;

/**
 * Gmod Called functions
 */
function GameDetails(
  servername,
  serverurl,
  mapname,
  maxplayers,
  steamid,
  gamemode,
  volume,
  language
) {
  debug("GameDetails called");
  isGmod = true;
  if (!isTest) {
    loadAll();
  }
  if (Config.ambientMusic) {
    startAmbientMusic(typeof volume === "number" ? volume : 0.5);
  }

  var titleText = Config.title || servername;
  $("#title").fadeIn();
  if (Config.typewriterTitle && titleText) {
    typewriterTitle(titleText, Config.typewriterSpeed || 45);
  } else {
    $("#title").html(titleText);
  }

  if (Config.enableMap) {
    $("#map").append(mapname);
    $("#map").fadeIn();
  } else {
    $("#map").hide();
  }

  if (Config.enableSteamID) {
    $("#steamid").html(steamid);
  }
  $("#steamid").fadeIn();
}

function SetFilesTotal(total) {
  debug("SetFilesTotal called total: " + total);
  totalCalled = true;
  totalFiles = total;
  loadStartTime = loadStartTime || Date.now();
  updateLoadingStats(0, total);
}

function SetFilesNeeded(needed) {
  debug("SetFilesNeeded called needed: " + needed);
  if (totalCalled) {
    var sPercentage = 100 - Math.round((needed / totalFiles) * 100);
    percentage = sPercentage;
    setLoad(sPercentage);
    lastNeededUpdate = Date.now();
    updateLoadingStats(totalFiles - needed, totalFiles);
  }
}

var fileCount = 0;
function DownloadingFile(filename) {
  filename = filename.replace("'", "").replace("?", "");
  debug("DownloadingFile called '" + filename + "'");
  downloadingFileCalled = true;
  $("#history").prepend('<div class="history-item">' + filename + "</div>");
  $(".history-item").each(function(i, el) {
    if (i > 10) {
      $(el).remove();
    }
    $(el).css("opacity", "" + 1 - i * 0.1);
  });
}

var allow_increment = true;
function SetStatusChanged(status) {
  debug("SetStatusChanged called '" + status + "'");
  $("#history").prepend('<div class="history-item">' + status + "</div>");
  $(".history-item").each(function(i, el) {
    if (i > 10) {
      $(el).remove();
    }
    $(el).css("opacity", "" + 1 - i * 0.1);
  });
  if (status === "Workshop Complete") {
    allow_increment = false;
    setLoad(80);
    updateLoadingStats(totalFiles, totalFiles, false);
  } else if (status === "Client info sent!") {
    allow_increment = false;
    setLoad(95);
    updateLoadingStats(totalFiles, totalFiles, false);
  } else if (status === "Starting Lua...") {
    setLoad(100);
    if (Config.showLoadingStats) $("#loading-stats").html("Complete");
  } else {
    if (allow_increment) {
      percentage = percentage + 0.1;
      setLoad(percentage);
    }
  }
}

/**
 * External Functions
 */
function loadAll() {
  $("nav").fadeIn();
  $("main").fadeIn();
  if (Config.ambientMusic && !isGmod) {
    startAmbientMusic(0.5);
  }

  // first time loading if DownloadingFile isn't called after some time
  setTimeout(function() {
    debug("Checking if first time loading.. " + downloadingFileCalled);
    if (downloadingFileCalled) {
      announce(
        "Good soldiers follow orders.",
        false
      );
    }
  }, 10000);
}
var backgroundCycleIndex = 0;
var backgroundCycleIntervalId = null;

function loadBackground() {
  if (Config.backgroundImages && Config.backgroundImages.length > 0) {
    setBackgroundImage(Config.backgroundImages[0]);
    if (Config.backgroundImages.length > 1 && Config.backgroundCycleInterval) {
      backgroundCycleIntervalId = setInterval(function() {
        backgroundCycleIndex = (backgroundCycleIndex + 1) % Config.backgroundImages.length;
        setBackgroundImage(Config.backgroundImages[backgroundCycleIndex]);
      }, Config.backgroundCycleInterval || 8000);
    }
  } else if (Config.backgroundImage) {
    setBackgroundImage(Config.backgroundImage);
  }
}

function setBackgroundImage(filename) {
  var $active = $(".background-a");
  var $inactive = $(".background-b");
  if ($active.hasClass("fading")) {
    $active = $(".background-b");
    $inactive = $(".background-a");
  }
  $inactive.css("background-image", 'url("images/' + filename + '")');
  $active.addClass("fading");
  $inactive.addClass("active");
  setTimeout(function() {
    $active.removeClass("fading").css("background-image", 'url("images/' + filename + '")');
    $inactive.removeClass("active");
  }, 1500);
}
function setLoad(percentage) {
  debug(percentage + "%");
  $(".loading-bar-fill").css("width", percentage + "%");
  if (percentage >= 100 && Config.showLoadingStats) {
    updateLoadingStats(totalFiles, totalFiles, true);
  }
}
var permanent = false;
function announce(message, ispermanent) {
  if (Config.enableAnnouncements && !permanent) {
    $("#announcement").hide();
    $("#announcement").html(message);
    $("#announcement").fadeIn();
  }
  if (ispermanent) {
    permanent = true;
  }
}
function debug(message) {
  if (Config.enableDebug) {
    console.log(message);
    $("#debug").prepend(message + "<br>");
  }
}

function startAmbientMusic(volume) {
  var audio = document.getElementById("ambient-music");
  if (!audio || !Config.ambientMusic) return;
  audio.src = "audio/" + Config.ambientMusic;
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.play().catch(function() {
    if (Config.enableDebug) console.log("Audio autoplay blocked");
  });
}

function typewriterTitle(text, speed) {
  $("#title").empty();
  var i = 0;
  function typeChar() {
    if (i < text.length) {
      $("#title").append(document.createTextNode(text.charAt(i)));
      i++;
      setTimeout(typeChar, speed);
    }
  }
  typeChar();
}

function updateLoadingStats(completed, total, done) {
  if (!Config.showLoadingStats) return;
  var $stats = $("#loading-stats");
  if (done || percentage >= 100) {
    $stats.html("Complete");
    return;
  }
  if (total === 0) return;
  var fileText = "File " + Math.min(completed, total) + " of " + total;
  var etaText = "";
  if (loadStartTime && completed > 0 && total > 0 && completed < total) {
    var elapsed = (Date.now() - loadStartTime) / 1000;
    var rate = completed / elapsed;
    var remaining = total - completed;
    var eta = Math.max(1, Math.ceil(remaining / rate));
    etaText = " &bull; ~" + eta + "s remaining";
  }
  $stats.html(fileText + etaText);
}

function initParticles() {
  if (!Config.enableParticles) return;
  var count = Config.particleCount || 25;
  var $container = $("#particles");
  for (var i = 0; i < count; i++) {
    var $p = $("<div>").addClass("particle");
    $p.css({
      left: Math.random() * 100 + "%",
      animationDelay: Math.random() * 15 + "s",
      animationDuration: (12 + Math.random() * 8) + "s"
    });
    $container.append($p);
  }
}

/**
 * Initial function
 */
$(document).ready(function() {
  // load everything in when ready
  loadBackground();
  initParticles();

  // print announcement messages every few seconds
  if (
    Config.announceMessages &&
    Config.enableAnnouncements &&
    Config.announcementLength
  ) {
    if (Config.announceMessages.length > 0) {
      var i = 0;
      setInterval(function() {
        announce(Config.announceMessages[i]);
        i++;
        if (i > Config.announceMessages.length - 1) {
          i = 0;
        }
      }, Config.announcementLength);
    }
  }

  // if it isn't loaded by gmod load manually
  setTimeout(function() {
    if (!isGmod) {
      debug("No Garry's mod testing..");
      isTest = true;
      loadAll();

      GameDetails(
        "Servername",
        "Serverurl",
        "Mapname",
        "Maxplayers",
        "SteamID",
        "Gamemode"
      );

      var totalTestFiles = 100;
      loadStartTime = Date.now();
      SetFilesTotal(totalTestFiles);

      var needed = totalTestFiles;
      setInterval(function() {
        if (needed > 0) {
          needed = needed - 1;
          SetFilesNeeded(needed);
          DownloadingFile("Filename " + needed);
        }
      }, 500);

      SetStatusChanged("Testing..");
    }
  }, 1000);
});
