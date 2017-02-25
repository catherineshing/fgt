# fgt

install node 4.x

npm install -g nodemon
npm install -g ejs
npm install -g bower

git clone https://github.com/catherineshing/fgt
cd fgt
npm install
bower install
mkdir app/src/server/images/tmp

nodemon app/app.js
