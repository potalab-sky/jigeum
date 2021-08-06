function traverse_directory(entry) {
  let reader = entry.createReader();
  // Resolved when the entire directory is traversed
  return new Promise((resolve_directory) => {
    var iteration_attempts = [];
    (function read_entries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.  Seriously??
      reader.readEntries((entries) => {
        if (!entries.length) {
          // Done iterating this particular directory
          resolve_directory(Promise.all(iteration_attempts));
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iteration_attempts.push(Promise.all(entries.map((entry) => {
            if (entry.isFile) {
              // DO SOMETHING WITH FILES
              return entry;
            } else {
              // DO SOMETHING WITH DIRECTORIES
              return traverse_directory(entry);
            }
          })));
          // Try calling readEntries() again for the same dir, according to spec
          read_entries();
        }
      }, errorHandler );
    })();
  });
}

// function exploreDirectory(entryItem) {
//   let reader = entryItem.createReader();
//   return new Promise(resolve => {
//     var promiseList = [];
//     (function readEntries() {
//       let entries = reader.readEntries;
//       if (!entries.length) {
//         resolve(Promise.all(promiseList));
//         return;
//       }
//
//       promiseList.push(Promise.all(entries.map(entryItem=> {
//         if (entryItem.isFile) {
//           return entryItem;
//         } else {
//           return exploreDirectory(entryItem);
//         }
//       })));
//     }());
//   });
// }