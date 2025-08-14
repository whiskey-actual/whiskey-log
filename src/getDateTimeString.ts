export default function getDateTimeString():string {

  let output:string = '';

  try {
    // parse the date/time ourselves, so we don't have any dependencies.
    const timestamp = new Date();
    const d = timestamp.getDate();
    const m = timestamp.getMonth() + 1;
    const y = timestamp.getFullYear();
    const date = `${y}-${m <= 9 ? "0" + m : m}-${d <= 9 ? "0" + d : d}`;

    const h = timestamp.getHours();
    const mm = timestamp.getMinutes();
    const s = timestamp.getSeconds();
    const time = `${h <= 9 ? "0" + h : h}:${mm <= 9 ? "0" + mm : mm}:${s <= 9 ? "0" + s : s}`;

    output = `${date} ${time}`

  } catch (err) {
    throw(`${arguments.callee.toString()}: ${err}`)
  }

  return output;
  
}