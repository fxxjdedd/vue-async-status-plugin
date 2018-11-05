let uid = -1;
const CHANGE_ASYNC_STATUS = 'CHANGE_ASYNC_STATUS';

export const statusTypes = {
  Loading: Symbol('loading'),
  Done: Symbol('done')
};

export default function createAsyncStatus(asyncTypes = [], getterName) {
  if(uid > 1000) {
    throw new Error('Error: too much asyncStatus plugins!');
  }
  uid += 1;
  return {
    plugin(store) {
      const statusChanger = hackInitStore(store, uid);
      for(let asyncType of asyncTypes) {
        statusChanger({
          type: asyncType,
          status: statusTypes.Done
        });
      }

      store.subscribeAction((action, payload) => {
        let asyncType;
        if((asyncType = asyncTypes.find(asyncType => asyncType.action === action.type))) {
          statusChanger({
            type: asyncType,
            status: statusTypes.Loading
          });
        }
      });

      // NOTE: mutation可能被多个action触发
      // FIXME: 目前的逻辑只支持一个action对应唯一一个mutation
      // FIXME: 如果一个action对应多个mutation，那么最终的异步状态取决于第一个执行完的mutation
      store.subscribe((mutation, payload) => {
        let asyncType;
        if((asyncType = asyncTypes.find(asyncType => asyncType.mutation === mutation.type))) {
          statusChanger({
            type: asyncType,
            status: statusTypes.Done
          });
        }
      });
    },
    getter(state) {
      const status = state.asyncStatus[uid];
      return !Object.values(status).some(d => d === statusTypes.Loading);
    }
  };
}

function hackInitStore(store, uid) {
  // hack
  const {state, _mutations} = store;  
  // hack init asyncStatus
  let status;
  if(!(status = state.asyncStatus)) state.asyncStatus = {};
  status[uid] = {};
  // hack init mutation
  const mutationType = genMutationType(CHANGE_ASYNC_STATUS, uid);
  // NOTE: _mutations的元素是数组
  const mutation = function(state, payload) {
    for(let key in payload) {
      state.asyncStatus[uid][key] = payload[key];
    }
    state.asyncStatus = Object.assign({}, state.asyncStatus);
  };
  registerMutation(store, mutationType, mutation, store);

  return function({type, status}) {
    const payload = {
      [genAsyncStatusType(type)]: status
    };
    store.commit(mutationType, payload);
  };
}

function genMutationType(type, uid) {
  return `${type}_${uid}`;
}

function genAsyncStatusType(type) {
  return `${type.action}-${type.mutation}`;
}

// from vuex store.js
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}