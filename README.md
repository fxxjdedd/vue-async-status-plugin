# vue-async-status-plugin
A safe way to get the async status

todos:
1. unit test
2. demo

note:
1. 目前无法在store.subscribe里获取到谁commit了当前的mutation，所以没法做到action和mutation的一一对应，只能粗粒度的，当一个mutation完成后，将所有使用该mutation的action状态设为Done. 所以提了这么一个[issue](https://github.com/vuejs/vuex/issues/1440), 如果没有这个功能，是很难做到action和mutation的一一对应的。即使做到了，也要写很多Hack代码，不值得。


