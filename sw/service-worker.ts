const _self = self as unknown as ServiceWorkerGlobalScope;

interface SourceFile {
  filename: string;
  text: string;
}

type SwEventData = InitEventData;

interface InitEventData {
  type: "init";
  files: SourceFile[];
  scope: string;
}

let resolveInit: () => void;
let files: SourceFile[] = [];
let scope: string = "";

const initPromise = new Promise<void>((resolve) => {
  resolveInit = resolve;
});

_self.addEventListener("message", (event) => {
  const eventData = event.data as SwEventData;
  switch (eventData.type) {
    case "init":
      files = eventData.files;
      scope = eventData.scope;
      resolveInit();
      break;
  }
});

_self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      await initPromise;
      const requestUrl = new URL(event.request.url);
      if (requestUrl.pathname.startsWith(scope)) {
        const filename = requestUrl.pathname
          .replace(scope, "")
          .replace(/^\//, "");
        const file = files.find(
          (f) => f.filename === filename || f.filename === `/${filename}`
        );
        if (file) {
          let contentType = "text/plain";
          if (file.filename.endsWith(".html")) {
            contentType = "text/html";
          } else if (file.filename.endsWith(".js")) {
            contentType = "application/javascript";
          } else if (file.filename.endsWith(".css")) {
            contentType = "text/css";
          } else if (file.filename.endsWith(".json")) {
            contentType = "application/json";
          } else if (file.filename.endsWith(".wasm")) {
            contentType = "application/wasm";
          }

          return new Response(file.text, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cross-Origin-Embedder-Policy": "require-corp",
            },
          });
        }
      }
      return fetch(event.request);
    })()
  );
});
