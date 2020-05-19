# React的初始化、更新流程

### 1.ReactDom.render渲染根节点

在react进行初始化的时候，会调用`ReactDom.render`进行初始化整个`react`树。`render`函数接收三个参数，分别是：

1. `ReactElement`：由`React.createElement`创建的元素，通常以jsx的形式，由loader进行转换。
2. `Container`：作为容器的标签
3. `callback`;

 进入到`ReactDom.render`这个方法内部，可以看到如下代码（之后代码都会去除掉dev环境下的判断）

```ts
render(
  // element是由jsx编译成React.createElement执行后返回的ReactElement
  element: React$Element<any>,
  // 承载的容器
  container: DOMContainer,
  callback: ?Function,
) {
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  return legacyRenderSubtreeIntoContainer(
    // 第一个传进来的是parentElement，因为是根部节点，所以没有父亲节点
    null,
    // 本reactElement
    element,
    // 容器
    container,
    // 强制融合，即渲染
    false,
    callback,
  );
}
```

`render`只是封装了一层顶层渲染。我们可以继续沿着legacyRender继续看下去。

```ts
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {
  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.
  // 根据root是否存在判断是否是第一次渲染
  let root: _ReactSyncRoot = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );

    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 这是第一次渲染的开端，使用不分批渲染，也就是尽快渲染，react的任务调度系统后面会讲到，先不关注
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // 更新
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```

我们会发现一个`updateContainer`这个方法，我们跑到`src\react\packages\react-reconciler\src\ReactFiberReconciler.js`下面文件中的`updateContainer`看一下执行的过程。

```ts
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  // 此时传进来处理的是React节点的类型，具体是一个对象，有$$typeof属性

  const current = container.current;
  const currentTime = requestCurrentTime();

  // 暂挂配置
  const suspenseConfig = requestCurrentSuspenseConfig();
  // 得到渲染的最长时间点，这个跟渲染队列相关
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig
  );
  
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    suspenseConfig,
    callback,
  );
}
```

`updateContainer`先获取到渲染的最长时间点，这个时间点要求`react`组件在截止日期前要渲染完毕，然后进入下一步调用。看到`updateContainerAtExpireationTime`

```ts
export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  // current是fiberNode，也就是虚拟节点
  const current = container.current;

  const context = getContextForSubtree(parentComponent);
  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  return scheduleRootUpdate(
    current,
    element,
    expirationTime,
    suspenseConfig,
    callback,
  );
}

function scheduleRootUpdate(
  current: Fiber,
  element: ReactNodeList,
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
  callback: ?Function,
) {
  const update = createUpdate(expirationTime, suspenseConfig);
  // Caution: React DevTools currently depends on this property
  // being called "element".
  update.payload = {element};

  callback = callback === undefined ? null : callback;
  if (callback !== null) {
    warningWithoutStack(
      typeof callback === 'function',
      'render(...): Expected the last optional `callback` argument to be a ' +
        'function. Instead received: %s.',
      callback,
    );
    update.callback = callback;
  }

  // 需要拿到current和update，然后进行更新操作
  enqueueUpdate(current, update);
  scheduleWork(current, expirationTime);

  return expirationTime;
}
```

到这里的话，将更新的操作交给队列和任务调度来完成，我们可以看到传给任务队列有三个内容：fiber、update、截止时间。任务队列会自动进行更新。

### 2.this.setState进行更新渲染

在`setState`的时候，也会进入到队列中自动更新，所以我的猜测是只需要传入三个参数，由任务队列来完成更新操作，所以我们的流程就走完了，接下来走任务队列的流程。

```ts
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

enqueueSetState(inst, payload, callback) {
  // 进入setstate，来了来了
  const fiber = getInstance(inst);    // 拿到fibernode，这个或许是react的虚拟dom节点
  const currentTime = requestCurrentTime();
  const suspenseConfig = requestCurrentSuspenseConfig();
  const expirationTime = computeExpirationForFiber(
  currentTime,
  fiber,
  suspenseConfig,
  );

  const update = createUpdate(expirationTime, suspenseConfig);
  update.payload = payload;
  if (callback !== undefined && callback !== null) {
  if (__DEV__) {
  warnOnInvalidCallback(callback, 'setState');
  }
  update.callback = callback;
  }

  // 特别注意一下这里的代码，第一次渲染时候的代码一致。
  enqueueUpdate(fiber, update);
  scheduleWork(fiber, expirationTime);
}
```

所以在触发任务调度之前，我们的流程就走完了。下面的步骤是来验证我们的想法是否正确。