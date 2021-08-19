function flattenData(data: any[]) {
    const flattenItems: any[] = [];

    function loop(data, _parent) {
        if (!Array.isArray(data)) {
            return;
        }

        data.forEach(item => {
            //if (item._parent !== _parent) item._parent = _parent;

            flattenItems.push(item);
            if (item.children) {
                loop(item.children, item);
            }
        });
    }

    loop(data, null);
    return flattenItems;
}

export default flattenData;
