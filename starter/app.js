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
     inputBtn: '.add__btn',
     incomeContainer: '.income__list',
     expensesContainer: '.expenses__list'

   };

   return {
     getInput: function(){
       return {  // either incom+ or expence-
         type: document.querySelector(domStrings.inputType).value,
         description: document.querySelector(domStrings.inputDescription).value,
         value: document.querySelector(domStrings.inputValue).value
       };
     },
     addListItem: function(obj,type){
       // create HTML string
       var html,newHtml,element;


       if (type === 'inc') {
         element = domStrings.incomeContainer;

         html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }else if(type === 'exp'){
         element = domStrings.expensesContainer;

         html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }

       // replace place holders with real data
       newHtml = html.replace('%id%',obj.id);
       newHtml = newHtml.replace('%description%', obj.description);
       newHtml = newHtml.replace('%value%',obj.value);

       // insert HTML into the DOM
       document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
     },
      // clear fields of user input
      clearFields: function(){
        var fields,fieldsArray;
        fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

        fieldsArray = Array.prototype.slice.call(fields);

        fieldsArray.forEach(function(current,index,array){
          current.value = '';
        });

        fieldsArray[0].focus();


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

  var updateBudget = function(){
    // 1. Calculate the budget

    // 2.retrun the budget

    // 3. Display the budget on the UI
  };

  var ctrlAddItem = function() {

    var input,newItem;
  // 1. get the feild input data
    input = UiCtr.getInput();

  // 2. Add the itum to the budget Controller
    newItem = budgetCtr.addItem(input.type,input.description,input.value);
  // 3. Add the item to the UI
    UiCtr.addListItem(newItem,input.type);
  // 4. clear fields
    UiCtr.clearFields();
  // 5. calculate and update budget 

};
return {
  init: function(){
    console.log('started');
    setUpEventListeners();
  }
};

})(budgetController, uiController);

appController.init();
