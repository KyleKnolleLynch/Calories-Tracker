//  Storage Controller







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
    items: [
    // {id: 0, name: 'Enchiladas', calories: 1140},
    // {id: 1, name: 'Tacos', calories: 600},
    // {id: 2, name: 'Waldorf Salad', calories: 240},
    // {id: 3, name: 'Tso\'s Tofu', calories: 350},
    // {id: 4, name: 'Ambrosia Salad', calories: 445}
    ],
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
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
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

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
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

    hideUL: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
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
const App = (function (ItemCtrl, UICtrl) {
  //  Load Event Listeners
  const loadEventListeners = function () {
    //  Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //  Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  
    // Edit update button event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  
  
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


      //  Clear Fields
      UICtrl.clearInput();
   
    }
    e.preventDefault();
  }

  //  Update item submit
  const itemUpdateSubmit = function (e) {
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
})(ItemCtrl, UICtrl);

//  Initialize App
App.init();