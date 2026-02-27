export const mfConfig = {
  name: "users_form",
  filename: "remoteEntry.js",
  exposes: {
    "./UserForm": "./src/UserForm",
  },
  // shared: ["react", "react-dom"],
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};
