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

   var calculateTotal = function(type){
     var sum = 0;
     data.allItems[type].forEach(function(curr){
       sum += curr.value;
     });
     data.totals[type] = sum;
   };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
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

      deletItem: function(type,id){
        var ids,index;


        ids = data.allItems[type].map(function(current) {
          return current.id;
        });

        index = ids.indexOf(id);

        if (index !== -1){
          data.allItems[type].splice(index,1);
        }
      },

      calculateBudget: function(){
         // 1.calc total inc and exp
          calculateTotal('inc');
          calculateTotal('exp');

         // 2.calc budget: inc - exp
         data.budget = data.totals.inc - data.totals.exp;
         // 3.calc percentage of income that we spent
         if (data.totals.inc > 0) {
           data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
         } else {
           data.percentage = -1;
         }

      },

      getBudget: function(){
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage

        };
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
     expensesContainer: '.expenses__list',
     budgetLabel: '.budget__value',
     incomeLabel: '.budget__income--value',
     expensesLabel: '.budget__expenses--value',
     percentageLabel: '.budget__expenses--percentage',
     container: '.container'
   };

   return {
     getInput: function(){
       return {  // either incom+ or expence-
         type: document.querySelector(domStrings.inputType).value,
         description: document.querySelector(domStrings.inputDescription).value,
         value: parseFloat(document.querySelector(domStrings.inputValue).value)
       };
     },
     addListItem: function(obj,type){
       // create HTML string
       var html,newHtml,element;


       if (type === 'inc') {
         element = domStrings.incomeContainer;

         html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }else if(type === 'exp'){
         element = domStrings.expensesContainer;

         html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

      displayBudget: function(obj){
        document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
        document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;

        if (obj.percentage > 0) {
          document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
          document.querySelector(domStrings.percentageLabel).textContent = '---';

        }

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

    document.querySelector(dom.container).addEventListener('click',ctrlDeletItem);
  };



  var updateBudget = function(){
    // 1. Calculate the budget
    budgetCtr.calculateBudget();
    // 2.retrun the budget
  var budget = budgetCtr.getBudget();
    // 3. Display the budget on the UI
    UiCtr.displayBudget(budget);
  };

  var ctrlAddItem = function() {

    var input,newItem;
  // 1. get the feild input data
    input = UiCtr.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the itum to the budget Controller
        newItem = budgetCtr.addItem(input.type,input.description,input.value);
      // 3. Add the item to the UI
        UiCtr.addListItem(newItem,input.type);
      // 4. clear fields
        UiCtr.clearFields();
      // 5. calculate and update budget
       updateBudget();
    }
};

  var ctrlDeletItem = function(event){
    var itemId,splitId,type,id;
    itemId = (event.target.parentNode.parentNode.parentNode.parentNode.id);
    if (itemId) {

        splitId = itemId.split('-');
        type = splitId[0];
        id = parseInt(splitId[1]);

        // 1. delet item from data structure
        budgetCtr.deletItem(type,id);
        //  2. delet item from the UI

        // 3. delet item from the budget

    }
  };

return {
  init: function(){
    console.log('started');
    UiCtr.displayBudget({budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: 0});
    setUpEventListeners();
  }
};
})(budgetController, uiController);

appController.init();
