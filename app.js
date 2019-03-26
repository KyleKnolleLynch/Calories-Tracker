//  Storage Controller
const StorageCtrl = (function () {
  //  Public Method
  return {
    storeItem: function (item) {
      let items;
      if (localStorage.getItem('items') === null) {
        let items = [];
        //  Push New item
        items.push(item);
        //  Store
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        //  Retrieve from Store
        items = JSON.parse(localStorage.getItem('items'));
        //  Push New item
        items.push(item);
        //  Reset Storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getStoredItems: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        console.log(items);
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        
     }
      return items;
    },
    
    updateItemsStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
    
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsStorage: function () {
      localStorage.removeItem('items');
    }

  }


})();






//  Item Controller
const ItemCtrl = (function () {
  //  Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }


  //  Data Structure / State Controller
  const state = {
    // items: [

    //       //      PLACEHOLDER STATE DATA
    // {id: 0, name: 'Enchiladas', calories: 1140},
    // {id: 1, name: 'Tacos', calories: 600},
    // {id: 2, name: 'Waldorf Salad', calories: 240},
    // {id: 3, name: 'Tso\'s Tofu', calories: 350},
    // {id: 4, name: 'Ambrosia Salad', calories: 445}
    // ],
    items: StorageCtrl.getStoredItems(),
    currentItem: null,
    totalCalories: 0
  }

  //  Public Method
  return {
    getItems: function () {
      return state.items;
    },

    addItem: function (name, calories) {
      let ID;
      //  Create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //  Calories to Number
      calories = parseInt(calories);

      //  Create New Item
      newItem = new Item(ID, name, calories);

      //  Push onto State items array
      state.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      //  Loop through items
      state.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      //  Calories to Integer
      calories = parseInt(calories);

      let found = null;
      state.items.forEach(function (item) {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      const ids = state.items.map(function (item) {
        return item.id;
      });

      //  Get Index
      const index = ids.indexOf(id);

      //  Remove item
      state.items.splice(index, 1);

    },

    clearAllItems: function () {
      state.items = [];
    },

    setCurrentItem: function (item) {
      state.currentItem = item;
    },

    getCurrentItem: function () {
      return state.currentItem;
    },

    getTotalCalories: function () {
      let total = 0;
      
      state.items.forEach(function (item) {
        total += item.calories;
      });
      //  Set total calculated calories in state structure
      state.totalCalories = total;
      
      return state.totalCalories;
    },

    logState: function () {
      return state;
    }
  }
})();






//  UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clrBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  //  Public Method
  return {
    populateItems: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      </li>`;
      });
      //  Insert items into html
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      //  Show UL
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //  Create li element
      const li = document.createElement('li');
      //  Add class
      li.className = 'collection-item';
      //  Add ID
      li.id = `item-${item.id}`;
      //  Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fas fa-pencil-alt"></i>
      </a>`;
      //  Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updatedListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //  Convert Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-pencil-alt"></i>
          </a>` ;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },


    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //  Convert Node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },


    hideUL: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },


    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    setClearState: function () {
      UICtrl.clearInput();  
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },


    showEditState: function () {  
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    

    getSelectors: function () {
      return UISelectors;
    }

  }
})();






//  App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //  Load Event Listeners
  const loadEventListeners = function () {
    //  Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //  Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  
    //  Disable Enter key submit
    document.addEventListener('keypress', function (e) { 
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon update event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
   
    // Update Button Submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    
    // Delete Button Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit); 
    
    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click',  function (e) {
      UICtrl.setClearState();
      e.preventDefault();
    });

    //  Clear All Event
    document.querySelector(UISelectors.clrBtn).addEventListener('click', clearAllClick);
  
  }


  //  Add item submit
  const itemAddSubmit = function (e) {
    //  Get form input from UI Controller
    const input = UICtrl.getItemInput();
    //  Check for input values
    if (input.name !== '' && input.calories !== '') {
      //  Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //  Add Item to UI list
      UICtrl.addListItem(newItem);
      //  Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //  Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //  Store Item
      StorageCtrl.storeItem(newItem);

      //  Clear Fields
      UICtrl.clearInput();
   
    } 
    e.preventDefault();
  }

  //  Update item Edit
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //  Get list item id
      const listId = e.target.parentNode.parentNode.id
      
      // Break into Array
      const idArray = listId.split('-');
      
      //  Get Array id integer
      const id = parseInt(idArray[1]);
      
      //  Get item
      const itemEdit = ItemCtrl.getItemById(id);

      //  Set current item
      ItemCtrl.setCurrentItem(itemEdit);

      // Add item to form
      UICtrl.addItemToForm();

    }
    e.preventDefault();
  }

  //  Update item Submit
  const itemUpdateSubmit = function (e) {
   //  Get item Input
    const input = UICtrl.getItemInput(); 

    //  Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //  Update UI
    UICtrl.updatedListItem(updatedItem);

     //  Get Total Calories
     const totalCalories = ItemCtrl.getTotalCalories();
     //  Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
    //  Update Storage
    StorageCtrl.updateItemsStorage(updatedItem);
    
    //  Set Initial State/Clear State
    UICtrl.setClearState();
    
    e.preventDefault();
  }
 

  //  Delete item Submit
  const itemDeleteSubmit = function (e) {
    const currentItem = ItemCtrl.getCurrentItem();

    //  Delete item from Data Structure
    ItemCtrl.deleteItem(currentItem.id);
    
    //  Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //  Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //  Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //  Delete from Storage
    StorageCtrl.deleteItemStorage(currentItem.id);

    //  Clear Input
    UICtrl.setClearState();

    e.preventDefault();
  }

  //  Clear All 
  const clearAllClick = function () {
    //  Delete from State Structure
    ItemCtrl.clearAllItems();

    //  Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //  Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);


    //  Remove from UI
    UICtrl.removeItems();

    UICtrl.hideUL();

    StorageCtrl.clearItemsStorage();

  }

  
 


  //  Public Method
  return {
    init: function () {
      //  Set Initial State/Clear State
      UICtrl.setClearState();
    
      //  Fetch items from state controller
      const items = ItemCtrl.getItems();
      
      //  Check for items / display UL
      if (items.length === 0) { 
         //  Hide UL
         UICtrl.hideUL();
      } else {
          //  Populate item list
        UICtrl.populateItems(items);
      }
      
       //  Get Total Calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //  Add Total Calories to UI
       UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();

    }
  }
})(ItemCtrl,StorageCtrl, UICtrl);

//  Initialize App
App.init();