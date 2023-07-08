/* eslint-disable @typescript-eslint/no-explicit-any, array-callback-return */
export const getMultiLevel = (key: string, obj: object) => {
  if (key.indexOf('.') === -1) {
    return (obj as any)[key];
  }

  return (
    obj &&
    key.split('.').reduce((mem, i) => {
      if (mem && mem.hasOwnProperty(i)) {
        return (mem as any)[i];
      }
    }, obj)
  );
};
