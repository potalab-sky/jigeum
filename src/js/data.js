class ItemInfo {
  #itemTable;
  #stack
  constructor(itemTable, rootItem) {
    console.log(itemTable);
    console.log(rootItem);
    this.#itemTable = itemTable;
    this.#stack = [];
  }

  *next() {
    let cur = this.#itemTable;
    for (;;) {
      if (cur === undefined) {
        console.log('first undefined');
        return null;
      }

      if (cur.length === undefined) {
        console.log('yield item: ' + cur.name);
        yield cur;
        cur = this.#out();
        continue;
      }

      if (!cur.length) {
        console.log('out [length empty]');
        cur = this.#out();
        console.log(cur);
        continue;
      }

      cur = this.#in(cur);
    }
  }

  #in(parent) {
    let child = parent.pop();
    this.#stack.push(parent);
    return child;
  }
  // eslint-disable-next-line no-dupe-class-members
  #out() {
    if (!this.#stack.length) {
      console.log('stack length 0');
    }
    return this.#stack.pop();
  }

  uploadFiles() {
    let item = this.next();
    if (item === null) {
      // this.requestDeploy(entryItem.name);
      console.log('deploy: ' + this.rootItem.name);
      return;
    }
    console.log(item.fullPath);
    let path = item.fullPath.replace(item.name, '');
    this.uploadFile(item, path, () => {
      this.uploadFiles();
    });
  }
}

export default ItemInfo