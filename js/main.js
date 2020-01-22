
let keys;

const documentList = document.querySelector('#user-list');
const documentForm = document.querySelector('#list-form');



generateList();
//console.log(keys);
documentList.addEventListener('click', listEventHandler);
documentForm.addEventListener('submit', addItem); 




// see if list item was checked off or deleted 

function listEventHandler(event) {
    //console.log(event.target.nodeName);
    // when delete button was clicked delete item
    if (event.target.classList.contains('list-remove')) {
        const id = event.target.parentNode.id;
        removeItem(id);     
    }
    // was checked off, so add complete class and update item's status in storage
    else if (event.target.nodeName == 'INPUT') {
        event.target.parentNode.classList.toggle('complete');
        let item = getFromStorage(event.target.parentNode.id);
        if (item.state == "complete") {
            item.state = "";
        }
        else {
            item.state = "complete";
        }
        saveToStorage(`li_${item.id}`, item);
    }
}

// get all items on load

function generateList() {
    if (keys = getFromStorage("listKeys")){
        //console.log(keys);
        keys.forEach(key => {
            const item = getFromStorage(key);
            //console.log(item);
            displayItem(item);
        });
    }
    else {
        keys = [];
    }
    
 
}






// remove item based on id

function removeItem(id) {
    const item = document.getElementById(id);
    item.remove();  // remove from DOM
    removeFromStorage(id);  // remove from localStorage
    keys.splice(keys.indexOf(id), 1);   // remove from array of keys
    saveToStorage('listKeys', keys);    // update localStorage
}




 // save to local storage

function saveToStorage(key, data) {
    if (localStorage) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.log("error: saving to localStorage failed.")
            console.log(error);
        }
        
    } 
    else {
        console.log("error: localStorage not found.");
    }
}




 
// get from local storage

function getFromStorage(key) {
    if (localStorage) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.log("error: fetching items from localStorage failed.")
            console.log(error);
        }
     }
     else {
        console.log("error: localStorage not found");
    }
}



 // delete from local storage

 function removeFromStorage(key) {
     if (localStorage) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log(`error: removing item with key: ${key} from localStorage failed.`)
            console.log(error);
        }

     }
     else {
        console.log("error: localStorage not found");
    }
 }



 // make new item

 function makeItem() {
    const inputField = documentForm.elements['user-input'];
    const userInput = inputField.value;
    const itemId = Date.now();
    const newItem = {id: itemId, text: userInput, state: ""};
    return newItem;
 }

 
  // display new item

  function displayItem(item) {
    // Test to see if the browser supports the HTML template element by checking
    // for the presence of the template element's content attribute.
    if ('content' in document.createElement('template')) {
        const template = document.querySelector('#li-template');
        const templateClone = template.content.cloneNode(true);
        const li = templateClone.querySelector('li');
        const input = templateClone.querySelector('input');
        const label = templateClone.querySelector('label');
        const text = templateClone.querySelector('.li-text');
        
        li.id = `li_${item.id}`;
        li.className = item.state;
        input.id = item.id;
        label.setAttribute("for", item.id);
        text.textContent = item.text;

        documentList.appendChild(templateClone);
        //console.log("appended via template");

    } 
    else {
        const liTemplate = 
                `
                <li class="${item.state}" id="li_${item.id}">
                    <input type="checkbox" id="${item.id}">
                    <label for="${item.id}">
                        <svg class="checkbox-graphic" viewBox="0 0 20 20">
                            <circle class="checkbox" cx="8" cy="8" r="7.5" transform="translate(2 2)"/>
                            <path  class="checkmark" d="M397.6,277.576l4.4,4.512,6.492-10.894" transform="translate(-391.608 -269.08)"/>
                        </svg>
                        <span class="li-text">${item.text}</span>
                    </label>
                    <button type="button" class="list-remove">remove</button>
                </li>
                `
        documentList.insertAdjacentHTML("beforeend", liTemplate);
        //console.log("appended via HTML insertion")
    }
  }


// adding new list elements 

 function addItem(event) {
    event.preventDefault();   

    newItem = makeItem();
    displayItem(newItem);

    documentForm.reset();
    //inputField.focus();

    const key = `li_${newItem.id}`;
    // add to item to localstorage
    saveToStorage(key, newItem);
    // add key to keys array
    keys.push(key);
    saveToStorage("listKeys", keys);
 }


