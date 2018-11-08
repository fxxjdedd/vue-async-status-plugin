# vue-async-status-plugin
A safe way to get the async status

todos:
1. unit test
2. demo
3. publish

note:
1. 目前无法在store.subscribe里获取到谁commit了当前的mutation，所以没法做到action和mutation的一一对应，只能粗粒度的，当一个mutation完成后，将所有使用该mutation的action状态设为Done. 所以提了这么一个[issue](https://github.com/vuejs/vuex/issues/1440), 如果没有这个功能，是很难做到action和mutation的一一对应的。即使做到了，也要写很多Hack代码，不值得。

2. 通过vue-router来[控制异步数据的获取](https://router.vuejs.org/zh/guide/advanced/data-fetching.html#%E5%AF%BC%E8%88%AA%E5%AE%8C%E6%88%90%E5%90%8E%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE)，也可以，但是我这种方案粒度更细，不需要阻塞路由。
