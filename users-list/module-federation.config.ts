export const mfConfig = {
  name: "users_list",
  filename: "remoteEntry.js",
  exposes: {
    "./UsersList": "./src/UsersList",
  },
  // shared: ["react", "react-dom"],
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};

export default mfConfig;  