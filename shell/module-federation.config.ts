export const mfConfig = {
  name: "shell",
  remotes: {
    users_list: "users_list@http://localhost:3001/remoteEntry.js",
    users_form: "users_form@http://localhost:3002/remoteEntry.js",
  },
  // shared: ["react", "react-dom"],
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
};

export default mfConfig;  