// ignore
var Config = {};

/**
 * What should the text in the center of the screen be?
 * if empty it will fill in your Server Name
 */
Config.title = "ZENITH PROJECT CW:RP";

/**
 * Enable map text in the top left corner of the screen?
 */
Config.enableMap = true;

/**
 * Enable steamId text in the top right corner of the screen?
 */
Config.enableSteamID = true;

/**
 * Enable announcements?
 */
Config.enableAnnouncements = true;

/**
 * What messages do you want to show up?
 * only works if enableAnnouncements = true
 */
Config.announceMessages = [
  "'BAD NADE!' -Every Clone Officer Ever.",
  "'Anyone else hear artillery?' -Mythic, blown up by Artillery moments later.",
  "'Was the civilian that you killed trying to attack you?' - 'Which one?' -CT-2954 Grem, war criminal.",
  "'Alright shock, WE are the shield' -CT-3339 Pavise",
  "'Fuck you I'm not a Pirate' -CT-3650 Hook",
  "'O- Oogadaboogada' -CT-5485 Viper",
  "'IT'S TIME TO ████' -CT-6969 Edge"
];

/**
 * How many miliseconds for each announcement?
 * only works if enableAnnouncements = true
 */
Config.announcementLength = 6000;

/**
 * Image Filename (single image - used when backgroundImages is empty)
 * DROP IMAGE IN "images" FOLDER
 */
Config.backgroundImage = "";

/**
 * Cycle through multiple background images
 * List all image filenames from the "images" folder - they will rotate every backgroundCycleInterval ms
 * If empty, uses Config.backgroundImage instead
 */
Config.backgroundImages = [
  "Kamino.png",
  "Mongazza.png",
  "newzenithbg.jpg",
  "Rothana.png"
];

/**
 * Milliseconds between each background image change (only when backgroundImages is used)
 */
Config.backgroundCycleInterval = 8000;

/**
 * Ambient music - filename in "audio" folder (e.g. "ambient.mp3")
 * Leave empty to disable. Supports mp3, ogg, wav
 */
Config.ambientMusic = "cwrploadtheme.mp3";

/**
 * Typewriter effect for title (characters appear one by one)
 */
Config.typewriterTitle = true;
Config.typewriterSpeed = 45;

/**
 * Subtle floating particles/dust
 */
Config.enableParticles = true;
Config.particleCount = 25;

/**
 * Show file count and estimated time (e.g. "File 12 of 45 • ~30s remaining")
 */
Config.showLoadingStats = true;

/**
 * Enable debug messages?
 */
Config.enableDebug = false;
