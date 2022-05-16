// outputs hex formatted for hoon
function format_hex(val) {
  return Array.from(val)
    .reverse()
    .reduce((prev, curr, index) => {
      if (index !== 0 && index % 4 === 0) {
        return prev.concat(`.${curr}`);
      } else {
        return prev.concat(curr);
      }
    }, "")
    .split("")
    .reverse()
    .join("");
}

console.log(format_hex(process.argv[2]));
