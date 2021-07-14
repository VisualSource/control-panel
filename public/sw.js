const CACHE = "WEB_GUI_CACHE";

self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');
    // Open a cache and use `addAll()` with an array of assets to add all of them
    // to the cache. Ask the service worker to keep installing until the
    // returning promise resolves.
    evt.waitUntil(caches.open(CACHE).then(function (cache) {
      cache.addAll([
        'main.css',
        'index.html',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "favicon.jpg",
        "aDjRH6.jpg",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
        'main.js',
        "modules/app_settings.js",
        "modules/lists.js",
        "modules/routes.js",
        "modules/server_console.js",
        "modules/server_control.js",
        "modules/server_props.js",
        "modules/socket_handler.js",
        "modules/toasts.js",
        "modules/world_manager.js"
      ]);
    }));
  });

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    // You can use `respondWith()` to answer ASAP...
    evt.respondWith(fromCache(evt.request));
    // ...and `waitUntil()` to prevent the worker to be killed until
    // the cache is updated.
    evt.waitUntil(
      update(evt.request)
      // Finally, send a message to the client to inform it about the
      // resource is up to date.
      .then(refresh)
    );
  });
  
  // Open the cache where the assets were stored and search for the requested
  // resource. Notice that in case of no matching, the promise still resolves
  // but it does with `undefined` as value.
  function fromCache(request) {
    if(request.endsWith(".js") || request.endsWith(".css") || request.endsWith(".html") || request.endsWith(".jpg") || request === "manifest.json"){
      return caches.open(CACHE).then(function (cache) {
        return cache.match(request);
      });
      return fetch(request);
    }
    return fetch(request);
  }
  
  
  // Update consists in opening the cache, performing a network request and
  // storing the new response data.
  function update(request) {
    return caches.open(CACHE).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response.clone()).then(function () {
          return response;
        });
      });
    });
  }
  
  // Sends a message to the clients.
  function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        // Encode which resource has been updated. By including the
        // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
        // check if the content has changed.
        var message = {
          type: 'refresh',
          url: response.url,
          // Notice not all servers return the ETag header. If this is not
          // provided you should use other cache headers or rely on your own
          // means to check if the content has changed.
          eTag: response.headers.get('ETag')
        };
        // Tell the client about the update.
        client.postMessage(JSON.stringify(message));
      });
    });
  }
