import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/inline-static-ui.mjs <html-file>");
  process.exit(1);
}

const source = fs.readFileSync(input, "utf8");
const bodyMatch = source.match(/<body[^>]*>([\s\S]*)<\/body>/i);

if (!bodyMatch) {
  console.error("No <body> found");
  process.exit(1);
}

const spacingScale = {
  "0": "0px",
  "1": "4px",
  "1.5": "6px",
  "2": "8px",
  "2.5": "10px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "9": "36px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
  "64": "256px",
};

const textScale = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
};

const fontWeights = {
  medium: "500",
  bold: "700",
};

const colors = {
  primary: "#84cc16",
  "primary-hover": "#65a30d",
  "primary-light": "#f7fee7",
  background: "#ffffff",
  surface: "#f5f5f5",
  "text-primary": "#374151",
  "text-secondary": "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
};

function pxToken(value) {
  if (spacingScale[value]) return spacingScale[value];
  if (/^\[(.+)\]$/.test(value)) return value.slice(1, -1);
  if (/^\d+$/.test(value)) return `${Number(value) * 4}px`;
  return null;
}

function setBoxAxis(style, axis, value) {
  if (axis === "x") {
    style.push(`padding-left:${value}`, `padding-right:${value}`);
  } else if (axis === "y") {
    style.push(`padding-top:${value}`, `padding-bottom:${value}`);
  } else if (axis === "l") {
    style.push(`padding-left:${value}`);
  } else if (axis === "r") {
    style.push(`padding-right:${value}`);
  } else if (axis === "t") {
    style.push(`padding-top:${value}`);
  } else if (axis === "b") {
    style.push(`padding-bottom:${value}`);
  } else {
    style.push(`padding:${value}`);
  }
}

function setMarginAxis(style, axis, value) {
  if (axis === "x") {
    style.push(`margin-left:${value}`, `margin-right:${value}`);
  } else if (axis === "y") {
    style.push(`margin-top:${value}`, `margin-bottom:${value}`);
  } else if (axis === "l") {
    style.push(`margin-left:${value}`);
  } else if (axis === "r") {
    style.push(`margin-right:${value}`);
  } else if (axis === "t") {
    style.push(`margin-top:${value}`);
  } else if (axis === "b") {
    style.push(`margin-bottom:${value}`);
  } else {
    style.push(`margin:${value}`);
  }
}

function colorValue(token, mode = "text") {
  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }
  if (colors[token]) return colors[token];
  if (mode === "text" && token === "white") return "#ffffff";
  return null;
}

function classToStyles(className, state) {
  const style = [];

  if (className === "flex") {
    state.hasDisplay = true;
    style.push("display:flex");
  } else if (className === "inline-flex") {
    state.hasDisplay = true;
    style.push("display:flex");
  } else if (className === "flex-col") {
    state.hasFlexDirection = true;
    style.push("flex-direction:column");
  } else if (className === "flex-row") {
    state.hasFlexDirection = true;
    style.push("flex-direction:row");
  }
  else if (className === "flex-1") style.push("flex:1 1 0%");
  else if (className === "shrink-0") style.push("flex-shrink:0");
  else if (className === "items-center") {
    state.needsFlex = true;
    style.push("align-items:center");
  } else if (className === "items-start") {
    state.needsFlex = true;
    style.push("align-items:flex-start");
  } else if (className === "justify-between") {
    state.needsFlex = true;
    style.push("justify-content:space-between");
  } else if (className === "justify-center") {
    state.needsFlex = true;
    style.push("justify-content:center");
  } else if (className === "justify-end") {
    state.needsFlex = true;
    style.push("justify-content:flex-end");
  }
  else if (className === "relative") style.push("position:relative");
  else if (className === "absolute") style.push("position:absolute");
  else if (className === "hidden") style.push("display:none");
  else if (className === "overflow-hidden") style.push("overflow:hidden");
  else if (className === "overflow-y-auto") style.push("overflow:hidden");
  else if (className === "min-w-0") style.push("min-width:0");
  else if (className === "w-full") style.push("width:100%");
  else if (className === "h-full") style.push("height:100%");
  else if (className === "h-screen") style.push("height:100%");
  else if (className === "w-screen") style.push("width:100%");
  else if (className === "mx-auto") style.push("margin-left:auto", "margin-right:auto");
  else if (className === "font-sans") style.push('font-family:"Inter", system-ui, sans-serif');
  else if (className === "antialiased") style.push("-webkit-font-smoothing:antialiased");
  else if (className === "uppercase") style.push("text-transform:uppercase");
  else if (className === "cursor-pointer") style.push("cursor:pointer");
  else if (className === "tracking-tight") style.push("letter-spacing:-0.02em");
  else if (className === "tracking-wide") style.push("letter-spacing:0.06em");
  else if (className === "tracking-wider") style.push("letter-spacing:0.08em");
  else if (className === "tracking-widest") style.push("letter-spacing:0.12em");
  else if (className === "drop-shadow-sm") style.push("text-shadow:0 1px 1px rgba(0,0,0,0.08)");
  else if (className === "rounded") style.push("border-radius:8px");
  else if (className === "rounded-sm") style.push("border-radius:4px");
  else if (className === "rounded-md") style.push("border-radius:8px");
  else if (className === "rounded-lg") style.push("border-radius:12px");
  else if (className === "rounded-full") style.push("border-radius:9999px");
  else if (className === "border") style.push("border:1px solid #e5e7eb");
  else if (className === "border-r") style.push("border-right:1px solid #e5e7eb");
  else if (className === "border-l-4") style.push("border-left:4px solid transparent");
  else if (className === "border-b") style.push("border-bottom:1px solid #e5e7eb");
  else if (className === "border-t") style.push("border-top:1px solid #e5e7eb");
  else if (className === "shadow-sm") style.push("box-shadow:0 1px 2px rgba(16,24,40,0.06)");
  else if (className === "transform") return style;
  else if (className === "rotate-45") style.push("transform:rotate(45deg)");
  else if (className === "top-1/2") style.push("top:50%");
  else if (className === "-translate-y-1/2") style.push("transform:translateY(-50%)");
  else if (className === "left-3") style.push("left:12px");

  let match;

  match = className.match(/^(p|px|py|pl|pr|pt|pb)-(.+)$/);
  if (match) {
    const value = pxToken(match[2]);
    if (value) setBoxAxis(style, match[1].slice(1), value);
  }

  match = className.match(/^(m|mx|my|ml|mr|mt|mb)-(.+)$/);
  if (match) {
    const value = pxToken(match[2]);
    if (value) setMarginAxis(style, match[1].slice(1), value);
  }

  match = className.match(/^gap-(.+)$/);
  if (match) {
    const value = pxToken(match[1]);
    if (value) {
      state.needsFlex = true;
      style.push(`gap:${value}`);
    }
  }

  match = className.match(/^space-y-(.+)$/);
  if (match) {
    const value = pxToken(match[1]);
    if (value) {
      state.needsFlex = true;
      state.wantsColumn = true;
      style.push(`gap:${value}`);
    }
  }

  match = className.match(/^(w|h|min-h)-\[(.+)\]$/);
  if (match) {
    const prop = match[1] === "w" ? "width" : match[1] === "h" ? "height" : "min-height";
    style.push(`${prop}:${match[2]}`);
  }

  match = className.match(/^(w|h)-(\d+)$/);
  if (match) {
    const prop = match[1] === "w" ? "width" : "height";
    const value = pxToken(match[2]);
    if (value) style.push(`${prop}:${value}`);
  }

  match = className.match(/^max-w-(.+)$/);
  if (match && match[1] === "7xl") style.push("max-width:1280px", "width:100%");

  match = className.match(/^grid-cols-(\d+)$/);
  if (match) {
    state.hasDisplay = true;
    state.gridCols = Number(match[1]);
    style.push("display:flex", "flex-wrap:wrap");
  }

  match = className.match(/^(md|lg):grid-cols-(\d+)$/);
  if (match) {
    state.hasDisplay = true;
    state.gridCols = Number(match[2]);
    style.push("display:flex", "flex-wrap:wrap");
  }

  if (className === "grid") {
    state.hasDisplay = true;
    style.push("display:flex", "flex-wrap:wrap");
  }

  match = className.match(/^text-(xs|sm|base|lg|xl|2xl)$/);
  if (match) style.push(`font-size:${textScale[match[1]]}`);

  match = className.match(/^font-(medium|bold)$/);
  if (match) style.push(`font-weight:${fontWeights[match[1]]}`);

  match = className.match(/^text-\[(.+)\]$/);
  if (match) style.push(`font-size:${match[1]}`);

  match = className.match(/^text-(primary|secondary|white)$/);
  if (match) {
    const value = colorValue(match[1], "text");
    if (value) style.push(`color:${value}`);
  }

  match = className.match(/^bg-(primary-light|primary|background|surface|white)$/);
  if (match) {
    const value = colorValue(match[1], "bg");
    if (value) style.push(`background:${value}`);
  }

  match = className.match(/^bg-\[(.+)\]$/);
  if (match) style.push(`background:${match[1]}`);

  match = className.match(/^border-(primary|border)$/);
  if (match) {
    const value = colorValue(match[1], "border");
    if (value) {
      style.push(`border-color:${value}`);
      style.push(`border-style:solid`);
    }
  }

  match = className.match(/^text-(\d+)$/);
  if (match) style.push(`font-size:${match[1]}px`);

  return style;
}

let body = bodyMatch[1]
  .replace(/<input([^>]*)placeholder="([^"]*)"([^>]*)\/?>/gi, '<div$1$3>$2</div>')
  .replace(/<input([^>]*)\/?>/gi, '<div$1></div>')
  .replace(/\s(?:href|type|placeholder)="[^"]*"/gi, "")
  .replace(/<button([^>]*)>/gi, '<div$1>')
  .replace(/<\/button>/gi, "</div>")
  .replace(/<a([^>]*)>/gi, '<div$1>')
  .replace(/<\/a>/gi, "</div>")
  .replace(/<main/gi, '<div')
  .replace(/<\/main>/gi, "</div>")
  .replace(/<header/gi, '<div')
  .replace(/<\/header>/gi, "</div>");

body = body.replace(/class="([^"]*)"/gi, (_match, classNames) => {
  const state = {};
  const styles = [];
  for (const className of classNames.split(/\s+/).filter(Boolean)) {
    styles.push(...classToStyles(className, state));
  }
  if (state.needsFlex && !state.hasDisplay) {
    styles.unshift("display:flex");
  }
  if ((state.wantsColumn || state.gridCols === undefined) && state.needsFlex && !state.hasFlexDirection) {
    styles.push(`flex-direction:${state.wantsColumn ? "column" : "row"}`);
  }
  if (state.gridCols) {
    styles.push(`--grid-cols:${state.gridCols}`);
  }
  let style = styles.join(";");
  if (state.gridCols) {
    return `style="${style}" data-grid-cols="${state.gridCols}"`;
  }
  return `style="${style}"`;
});

body = body.replace(/\sdata-grid-cols="[^"]*"/g, "");
body = body.replace(/<!--[\s\S]*?-->/g, "");
body = body.replace(/\n+/g, " ");
body = body.replace(/\s{2,}/g, " ");
body = body.replace(/\sstyle=";*/g, ' style="');
body = body.replace(/style="([^"]*)"/g, (_m, styles) => {
  const cleaned = styles
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  return cleaned.length ? `style="${cleaned.join(";")}"` : "";
});

const title = path.basename(input, ".html");
const output = `<div layer-name="${title}" style="display:flex;flex-direction:row;width:1440px;height:900px;background:#f9fafb;font-family:&quot;Inter&quot;,system-ui,sans-serif;color:#374151;overflow:hidden">${body.trim()}</div>`;

process.stdout.write(output);
