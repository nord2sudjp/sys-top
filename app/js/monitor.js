const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Set model
document.getElementById("cpu-model").innerText = cpu.model();
