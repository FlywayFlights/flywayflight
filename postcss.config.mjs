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
        "color-function": true,
        "oklab-function": true,
      },
    },
  },
};

export default config;
