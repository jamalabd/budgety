// Budget Controller
 var budgetController = (function(){
   var Expense = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
   };
   var Income = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
   };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }
    };

    return {
      addItem: function(type,des,val){
        var newItem,id;

        // create new ID
        if (data.allItems[type].length > 0) {
          id = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
          id = 0;
        }


        // creats new item based on 'inc' or 'exp'
        if(type === 'exp'){
          newItem = new Expense(id,des,val);
        }else if (type === 'inc') {
          newItem = new Income(id,des,val);
        }else {
          alert('console.error');
        }

        // pushes it to the data structure
        data.allItems[type].push(newItem);
        return newItem;
      },

      testing: function() {
        console.log(data);
      }

    };

 })();


// UI controller
 var uiController = (function(){

   var domStrings = {
     inputType: '.add__type',
     inputDescription: '.add__description',
     inputValue: '.add__value',
     inputBtn: '.add__btn'
   };

   return {
     getInput: function(){
       return {
         type: document.querySelector(domStrings.inputType).value, // either incom+ or expence-
         description: document.querySelector(domStrings.inputDescription).value,
         value: document.querySelector(domStrings.inputValue).value
       };
     },
     getDomStrings: function() {
       return domStrings;
     }
   };

 })();



 // App Controller

var appController = (function(budgetCtr,UiCtr){

  var setUpEventListeners = function(){
    var dom = UiCtr.getDomStrings();
    document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if(event.keycode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {

    var input,newItem;
  // 1. get the feild input data
    input = UiCtr.getInput();

  // 2. Add the itum to the budget Controller
    newItem = budgetCtr.addItem(input.type,input.description,input.value);
  // 3. Add the item to the UI

  // 4. Calculate the budget

  // 5. Display the budget on the UI
};
return {
  init: function(){
    console.log('started');
    setUpEventListeners();
  }
};

})(budgetController, uiController);

appController.init();
