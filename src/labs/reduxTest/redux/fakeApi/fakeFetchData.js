import {UN_RESOlVLE} from "../TODO_TYPE";

export const getTodo = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        id: 1000,
        content: 'fetch的数据',
        status: UN_RESOlVLE
      })
    }, 2000);
  })
}