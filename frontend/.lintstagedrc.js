const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  // "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  // "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"]
  "*": (files) => {
    const isAppFolderChanges = files.some((fileName) => fileName.includes("/frontend/"));
    const scripts = ["npm run lint", "npm run format"];

    return isAppFolderChanges ? scripts : [];
  }
};
