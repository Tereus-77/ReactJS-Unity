import { UnityContext } from "react-unity-webgl";

/**
 * Unity Context is stored in a constant to keep it in memory during the
 * lifetime of the application. It may be provided to Unity Components.
 */
const unityContext = new UnityContext({
  // The paths to the Unity WebGL build.
  loaderUrl: "/game-build/Solajump.loader.js",
  dataUrl: "/game-build/Solajump.data",
  frameworkUrl: "/game-build/Solajump.framework.js",
  codeUrl: "/game-build/Solajump.wasm",
});

export { unityContext };
