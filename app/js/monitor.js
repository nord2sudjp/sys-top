const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 5;

// Run every 2 seconds

setInterval(() => {
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
    document.getElementById("cpu-progress").style.width = info + "%";
  });
  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText = info + "%";
  });

  document.getElementById("sys-uptime").innerText = secToDh(os.uptime());
}, 2000);

// Set system infomration
document.getElementById("cpu-model").innerText = cpu.model();
document.getElementById("comp-name").innerText = os.hostname();
document.getElementById("os").innerText = `${os.type()} ${os.arch()}`;

mem.info().then((info) => {
  document.getElementById("mem-total").innerText = info.totalMemMb;
});

function secToDh(sec) {
  sec = +sec;
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % (3600 * 24)) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${d}d, ${h}h,${m}m,${s}s`;
}
