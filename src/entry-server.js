import { createApp } from './main'

export default context => {
  return new Promise((resolve, reject) => {
    const {
      app,
      router,
      store
    } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject(new Error(404))
      }

      // call `prefetchData()` on all matched route components
      Promise.all(matchedComponents.map(Component => {
        if (Component.prefetchData) {
          return Component.prefetchData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // When we attach the state to the context, and the `template` option
        // is used for the renderer, the state will automatically be
        // serialized and injected into the HTML as `window.__INITIAL_STATE__`.
        context.state = store.state

        resolve(app)
      })
    }, reject)
  })
}
