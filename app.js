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
    {id: 0, name: 'Enchiladas', calories: 1140},
    {id: 1, name: 'Tacos', calories: 600},
    {id: 2, name: 'Waldorf Salad', calories: 240},
    {id: 3, name: 'Tso\'s Tofu', calories: 350},
    {id: 4, name: 'Ambrosia Salad', calories: 445}
    ],
    currentItem: null,
    totalCalories: 0
  }

  //  Public Method
  return {
    getItems: function () {
      return state.items;
    },
    logState: function () {
      return state;
    }
  }
})();






//  UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: 'item-list'
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
      document.getElementById(UISelectors.itemList).innerHTML = html;
    }
  }
})();






//  App Controller
const App = (function (ItemCtrl, UICtrl) {
  

  //  Public Method
  return {
    init: function () {
      //  Fetch items from state controller
      const items = ItemCtrl.getItems();

      //  Populate item list
      UICtrl.populateItems(items);
      
    }
  }
})(ItemCtrl, UICtrl);

//  Initialize App
App.init();