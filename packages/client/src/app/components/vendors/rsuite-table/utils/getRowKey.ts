export type RowKeyType = string | number;
export default function (row: any, rowKey: RowKeyType | ((row: object) => RowKeyType) | undefined) {
    function ejecuta(){
        if (typeof rowKey === "function") {
            return rowKey(row);
        } else if (rowKey) {
            return row[rowKey];
        } else return "";
    }
    let result = ejecuta();
   return result;

}