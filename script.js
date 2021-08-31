'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `        
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovement(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcom back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.usename !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // indexOf(2)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2,4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-2));
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE
// //console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1,2);
// console.log(arr);

// // REVERSE
// arr = ['a','b','c','d','e']
// const arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse);
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr,...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls);
// //for(const movement of movements){
// for(const[i,movement] of movements.entries()){
// if(movement>0){
//     console.log(`Movement ${i+1}: You depostied ${movement}`);
//   }
//   else{
//     console.log(`Movement ${i+1}:  You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('---FOREACH ----');
// movements.forEach(function(mov,i,r){
//   if(mov>0){
//     console.log(`Movement ${i+1}: You depostied ${mov}`);
//   }
//   else{
//     console.log(`Movement ${i+1}:  You withdrew ${Math.abs(mov)}`);
//   }
// })
//0:function(200)
//0:function(450)
//0:function(400)
//...

//Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// })
// //Set
// const currenciesUnique = new Set(['USD','GBP','USD','EUR','EUR'])
// console.log(currenciesUnique);
// currenciesUnique.forEach(function(value,_value,map){
//   console.log(`${value}: ${value}`);
// })

// const checkDogs = function(dogsJulia,dogsKate){
//   //const copyOfJulia = [...dogsJulia].slice(1,3);
//   //const combineJulKat = [...copyOfJulia,...dogsKate]
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0,1);
//   dogsJuliaCorrected.splice(-2);
//   const dogs = dogsJuliaCorrected.concat(dogsKate)
//   dogs.forEach(function(value,key,array){
//       return value >=3 ? console.log(`Dog number ${key+1} is an adult, and is ${value} years old`)  :
//        console.log(`Dog number ${key+1} is still a puppy`);
//    })

// }
// const julia = [3,5,2,12,7]
// const kate = [4,1,15,8,3]
//  checkDogs(julia,kate)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// // const movementUSD = movements.map(function(mov){
// //    return mov *eurToUsd
// //   //return 23;
// // })
// const movementUSD = movements.map(mov=>mov*eurToUsd)

// console.log(movements);
// console.log(movementUSD);

// const movementsUSDfor = [];
// for(const move of movements) movementsUSDfor.push(move*eurToUsd)
// console.log(movementsUSDfor);

// const movementDescriptions= movements.map((mov,i)=>{
//   `Movement ${i+1}: You ${mov>0? 'depostied': 'withdrew'} ${Math.abs(mov)}`
// })
// console.log(movementDescriptions);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// accumulator => snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 100);
// console.log(balance);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // Maximum value
// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );
// console.log(max);

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = function (ages) {
//   return ages
//     .map(age => (age <= 2 ? (age = age * 2) : (age = 16 + age * 4)))
//     .filter(age => age > 18)
//     .reduce((acc, sum, i, arr) => (acc += sum / arr.length), 0);
// };

// console.log(calcAverageHumanAge(data1));
// console.log(calcAverageHumanAge(data2));

// const calcAverageHumanAge2 = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age > 18);
//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   return average;
// };
// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// console.log(movements);
// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     //console.log(arr);
//     return mov * eurToUsd;
//   })
//   //.map((mov=> mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const caclAverageHumanAge = function (ages) {
//   return ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age > 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// };
// console.log(caclAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(caclAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);

// EQUALITY
// console.log(movements.includes(-130));

// // CONDITION
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // Every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((arr, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance2);

// Strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);

// return <0 A,SB(keep)
// return >0 B,A(switch)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// movements.sort((a, b) => a - b);

// console.log(movements);

// //Descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });
// movements.sort((a, b) => b - a);

// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // emptry arrays = fill method
// const x = new Array(7);
// console.log();
// //console.log(x.map(() => 5));
// //x.fill(1);

// x.fill(1, 3);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// //Array.From
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const randomDice = Array.from({ length: 100 }, (_, i) =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(randomDice);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
//   console.log(movementsUI);
//   //const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });

// // 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc.movements)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);
// // 2.
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   //.reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       //cur > 0 ? (sums.deposits += cur) : (sum.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title => This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (expections.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75)));
// console.log(dog);

// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating ${dogSarah.curFood > dogs.recFood ? 'much' : 'little'}`
// );

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);

// console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much!`);

// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
// console.log(dogs.some(checkEatingOkay));
// console.log(dogs.filter(checkEatingOkay));
// const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsSorted);
// const ownersEatTooMuch = [];
// const owenrsEatTooLittle = [];
// dogs.forEach((_, i) => {
//   dogs[i].recommendedFood = dogs[i].weight ** 0.75 * 28;
//   if (dogs[i].owners.includes('Sarah')) {
//     dogs[i].curFood > dogs[i].recommendedFood
//       ? console.log('eating too much')
//       : console.log('eating too less');
//   }
//   dogs[i].curFood > dogs[i].recommendedFood
//     ? ownersEatTooMuch.push(dogs[i].owners)
//     : owenrsEatTooLittle.push(dogs[i].owners);
// });
// const print = function (arr) {
//   console.log(`${arr.flat().join(' and ')}'s dogs eat too much!`);
// };
// print(ownersEatTooMuch);
// print(owenrsEatTooLittle);
// const okay = [];
// for (const item of dogs) {
//   item.curFood > item.recommendedFood * 0.9 &&
//   item.curFood < item.recommendedFood * 1.1
//     ? okay.push(item)
//     : console.log();
// }
// console.log(okay);
// const copy = dogs.slice();
// copy.sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(copy);
dogs.forEach(dog => (dog.recomFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);
const sarah = dogs.find(dog => dog.owners.includes('Sarah'));
sarah.recomFood > sarah.curFood
  ? console.log('eat too much')
  : console.log('eat too less');
const ownersEatTooMuch = dogs
  .filter(dog => dog.recomFood > dog.curFood)
  .map(dog => dog.owners)
  .flat();
const ownersEatTooLess = dogs
  .filter(dog => dog.recomFood < dog.curFood)
  .map(dog => dog.owners)
  .flat();
console.log(ownersEatTooMuch);
console.log(ownersEatTooLess);
console.log(`${ownersEatTooLess.join(' and ')}'s dogs eat too less`);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much  `);

console.log(dogs.some(dog => dog.curFood === dog.recomFood));

const check = dog =>
  dog.curFood > dog.recomFood * 0.9 && dog.curFood < dog.recomFood * 1.1;

console.log(dogs.some(check));
const okay = dogs.filter(check);
console.log(okay);
const copy = dogs.slice().sort((a, b) => a.recomFood - b.recomFood);
console.log(copy);
