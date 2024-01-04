React native mobile app, inspired by carousell
PYTHON SCRIPTS
databasejj.py : script to create db.sqlite, with product/order table
carrotselldb.py : script to create carrotusers.sqlite, with user table
carrotflask.py : script to start flask server

SETUP REACT NATIVE PROJECT
- open terminal from vscode, use this command to setup all dependencies
npm install --legacy-peer-deps

TO RUN FLASK
- open another terminal from vscode, use these 2 lines:
cd python
python carrotflask.py

START ANDROID
npx react-native run-android


IF HOME PAGE SHOWS NO PRODUCTS
CHANGE THE VALUE OF VARIABLE "name"  in method

this.db = SQLite.openDatabase(
      {name: 'database', createFromLocation: '~karotdb.sqlite'},
      this.openCallback,
      this.errorCallback,
    );

IN THE FILES:
BuyScreen.js
HomeScreen.js
MyProductScreen.js
preview_item.js
ProductScreen.js
SearchScreen.js
sell_screen.js

NAME CAN BE CHANGED TO ANYTHING, 
BUT ENSURE CHANGED TO THE SAME NAME IN ALL THE ABOVE FILES

