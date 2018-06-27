// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items;
      // Check LS if any items are there
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push the new item
        items.push(item);
        // Set LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item
        items.push(item);
        // Re-set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      // Loop thru items
      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      // Loop thru items
      items.forEach(function(item, index) {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data Structure / State
  const data = {
    // items: [
      // { id: 0, name: 'Steak Dinner', calories: 1200 },
      // { id: 1, name: 'Cookie', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getTotalCalories: function () {
      let total = 0;
      // Loop thru items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;
      // Return total
      return data.totalCalories;
    },

    getItems: function () {
      return data.items;
    },

    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Parse Calories as a number
      calories = parseInt(calories);
      // Create new Item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);
      // Splice out of array / remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    logData: function () {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    clearBtn: '.clear-btn',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}</strong>
                  <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                    <i class="fa fa-pencil edit-item"></i>
                  </a>
                </li>`;
      });
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },

    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item'
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}</strong>
      <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="fa fa-pencil edit-item"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Loop thru nodeList by converting into an array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>
          `;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into Array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      })
    },

    clearInputs: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInputs();
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

    updateCalorieCounter: function () {
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
    },

    getSelectors: function () {
      return UISelectors;
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Event Listener Loader
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Icon Click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }
  // Add Item Submit
  const itemAddSubmit = function (e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      UICtrl.updateCalorieCounter();
      // Store in local Storage
      StorageCtrl.storeItem(newItem);
      // Clear Fields
      UICtrl.clearInputs();
    }

    e.preventDefault();
  }
  // Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list Item ID (item-0, etc)
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listId.split('-');
      // Get actual Id
      const id = parseInt(listIdArr[1]);
      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }
  // Update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update UI
    UICtrl.updateListItem(updatedItem);
    // Update calorie counter
    UICtrl.updateCalorieCounter();
    // Update LS 
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
    if (items.length === 0) {
      UICtrl.hideList();
    }
    e.preventDefault();
  }

  // Delete Items event
  const itemDeleteSubmit = function (e) {
    // Get item ID from currentItem
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data Structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete List Item From UI
    UICtrl.deleteListItem(currentItem.id);
    // Update calorie counter
    UICtrl.updateCalorieCounter();
    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    e.preventDefault();
  }

  // Clear Items event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    // Update calorie counter
    UICtrl.updateCalorieCounter();
    // Remove from UI
    UICtrl.clearItems();
    // Clear from LS
    StorageCtrl.clearAllFromStorage();
    // Hide the ul
    UICtrl.hideList();
  }
  // Public methods
  return {
    init: function () {
      // Clear edit state / set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }

      // Update calorie counter
      UICtrl.updateCalorieCounter();

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize app
App.init();