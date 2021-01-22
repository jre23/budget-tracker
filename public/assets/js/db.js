// create a new request for a budget indexedDB
const request = window.indexedDB.open("budget", 1);
// create schema
request.onupgradeneeded = event => {
    const db = event.target.result;
    // create an objectStore called "pending" and set autoIncrement to true
    db.createObjectStore("pending", {
        autoIncrement: true
    });
};
// if request is successful, check if the browser is online then invoke checkDatabase function
request.onsuccess = event => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};
// if request returns an error
request.onerror = event => {
    console.log(event);
}
// function to save a record if browser if offline
const saveRecord = record => {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    // access the pending objectStore
    const pendingStore = transaction.objectStore("pending");
    // add the record to the pending objectStore
    pendingStore.add(record);
}
// function to check the budget indexedDB to see if there is any pending object stores and if so, add them to the mongodb using api/transaction/bulk post method
const checkDatabase = () => {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    // access the pending objectStore
    const pendingStore = transaction.objectStore("pending");
    // get all records (if any) from the pending objectStore
    const allPending = pendingStore.getAll();
    // if getAll() is successful
    allPending.onsuccess = () => {
        // check if the pendingStore has anything in it, if so post it to mongodb then clear the pendingStore
        if (allPending.result.length > 0) {
            fetch("api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(allPending.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            }).then(res => {
                res.json();
            }).then(() => {
                // create a transaction on the pending db with readwrite access
                const transaction = db.transaction(["pending"], "readwrite");
                // access the pending objectStore
                const pendingStore = transaction.objectStore("pending");
                // clear all items in the pendingStore
                pendingStore.clear();
            });
        }
    };
}

// listen for app coming back online and invoke checkDatabase function
window.addEventListener('online', checkDatabase);