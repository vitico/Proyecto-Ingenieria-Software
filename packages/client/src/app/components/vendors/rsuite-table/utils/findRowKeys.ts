import getRowKey, {RowKeyType} from "./getRowKey";

export default function findRowKeys(rows: any[], rowKey: RowKeyType | ((row:any)=> RowKeyType) | undefined, expanded?: boolean) {
  let keys: any[] = [];
  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    if (item.children) {
      keys.push(getRowKey(item,rowKey));
      keys = [...keys, ...findRowKeys(item.children, rowKey)];
    } else if (expanded) {
      keys.push(getRowKey(item,rowKey));
    }
  }
  return keys;
}
