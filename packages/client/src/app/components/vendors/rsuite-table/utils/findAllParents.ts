import getRowKey from "./getRowKey";

export default function findAllParents(rowData, rowKey): any[] {
  const parents: any[] = [];

  if (!rowData) {
    return parents;
  }

  function findParent(data) {
    if (data) {
      parents.push(getRowKey(data,rowKey));
      if (data._parent) {
        findParent(data._parent);
      }
    }
  }
  findParent(rowData._parent);
  return parents;
}
