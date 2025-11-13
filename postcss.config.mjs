const config = {
  plugins: ["@tailwindcss/postcss"],
};
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "color-function": false,
        "oklab-function": false,
      },
    },
  },
};

export default config;
