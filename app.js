// Budget Controller
 var budgetController = (function(){
   var Expense = function(id,description,value){
     this.id = id;
     this.description = description;
     this.value = value;
     this.percent = -1;
   };

   Expense.prototype.calcPercent = function(totalIncome){
     if (totalIncome > 0) {
        this.percent = Math.round((this.value / totalIncome) * 100);
     }else {
       this.percent = -1;
     }
   };

   Expense.prototype.getPercent = function(){
     return this.percent;
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

      calculatePercent: function(){
        data.allItems.exp.forEach(function(curr){
          curr.calcPercent(data.totals.inc);
        });
      },

      getPercent: function(){
        var allPercent = data.allItems.exp.map(function(curr){
          return curr.getPercent();
        });
        return allPercent;
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
     container: '.container',
     expPercentLabel: '.item__percentage',
     dateLabel: '.budget__title--month'
   };
   var formatNumber = function(num,type){
     var int,dec,numSplit,sign;

     num = Math.abs(num);
     num = num.toFixed(2);

     numSplit = num.split('.');

     int = numSplit[0];

     if (int.length > 3) {
      int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);
    }
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list,callb){
    for (var i = 0; i < list.length; i++) {
      callb(list[i], i);
    }
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

         html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
       }else if(type === 'exp'){
         element = domStrings.expensesContainer;

         html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>';
       }

       // replace place holders with real data
       newHtml = html.replace('%id%',obj.id);
       newHtml = newHtml.replace('%description%', obj.description);
       newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));

       // insert HTML into the DOM
       document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
     },

     deleteListItem: function (selectorId){
       var element = document.getElementById(selectorId);

       element.parentNode.removeChild(element);
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
        var type;
        obj.budget > 0 ? type = 'inc': type = 'exp';

        document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
        document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if (obj.percentage > 0) {
          document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
          document.querySelector(domStrings.percentageLabel).textContent = '---';

        }

      },

      displayPercent: function(percentage){

        var fields = document.querySelectorAll(domStrings.expPercentLabel);

        nodeListForEach(fields,function(curr,index){
          if (percentage[index] > 0) {
            curr.textContent = percentage[index] + '%';
          }else {
            curr.textContent = '---';
          }

        });

      },

      displayMonth: function(){
        var now,year,months;
        now = new Date();
        months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];
        month = now.getMonth();
        year = now.getFullYear();
        document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
      },

      changeType: function(){
        var fields;
        fields = document.querySelectorAll(domStrings.inputType + ',' + domStrings.inputDescription + ',' + domStrings.inputValue);

      nodeListForEach(fields, function(curr){
        curr.classList.toggle('red-focus');
      });
      document.querySelector(domStrings.inputBtn).classList.toggle('red');

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

    document.querySelector(dom.inputType).addEventListener('change', UiCtr.changeType);


  };



  var updateBudget = function(){
    // 1. Calculate the budget
    budgetCtr.calculateBudget();
    // 2.retrun the budget
  var budget = budgetCtr.getBudget();
    // 3. Display the budget on the UI
    UiCtr.displayBudget(budget);
  };

  var updatePercent =function(){
    // 1. calculate percent
    budgetCtr.calculatePercent();
    // 2. read from the budget Controller
  var percentages = budgetCtr.getPercent();
    // 3. update the iu eith the new percentages
    UiCtr.displayPercent(percentages);
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
      // 6. calculate and update percentages
       updatePercent();
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
        UiCtr.deleteListItem(itemId);
        // 3. delet item from the budget
        updateBudget();
        // 4. calculate and update percentages
         updatePercent();
    }
  };

return {
  init: function(){
    console.log('started');
    UiCtr.displayMonth();
    UiCtr.displayBudget({budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: 0});
    setUpEventListeners();
  }
};
})(budgetController, uiController);

appController.init();
