if(typeof window === 'undefined'){
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('active', (e) => e.waitUntill(self.clients.claim()));

    self.addEventListener('fetch', (e) => {
        const req = e.request;
        e.respondWith(
            fetch(req)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
}
else {
    if(window.crossOriginIsolated) return;
    navigator.serviceWorker.register(document.currentScript.src).then(
        (reg)=>{
            reg.addEventListener('updatefound', ()=>{ location.reload(); });
            if(reg.active && !navigator.serviceWorker.controller){
                location.reload();
            }
        }
    )
}