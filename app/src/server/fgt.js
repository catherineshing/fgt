'use strict';

var Q = require('q'),
    _ = require('lodash'),
    crypto = require('crypto'),
    fs = require('fs'),
    info = require(__dirname + '/info.json'),
    itemsFile = __dirname + '/items.json';


function login(password) {
    console.log('BEGIN login');

    var deferred = Q.defer(),
        hash = crypto.createHash('sha256').update(password).digest('hex');

    if (hash === info.login) {
        deferred.resolve();
        console.log('END login RESOLVED');
    } else {
        deferred.reject('Invalid password');
        console.log('END login REJECTED');
    }

    return deferred.promise;
}

function getItems(args) {
    console.log('BEGIN getItems ' + (args || '{}'));

    var deferred = Q.defer(),
        items = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));

    args = getArgs(args);

    if (args.category) {
        items = _.filter(items, function(item) {
            return item.category === args.category;
        });
    }

    if (_.isNumber(args.start) && _.isNumber(args.count)) {
        items = items.slice(args.start, args.start + args.count);
    }

    deferred.resolve(items);
    console.log('END getItems RESOLVED');

    return deferred.promise;
}

function getItem(itemId, args) {
    console.log('BEGIN getItem');

    var deferred = Q.defer(),
        items = JSON.parse(fs.readFileSync(itemsFile, 'utf8')),
        index,
        result;

    args = getArgs(args);

    if (args.category) {
        items = _.filter(items, function(item) {
            return item.category === args.category;
        });
    }

    index = _.findIndex(items, function(item) {
        return itemId === item.id;
    });

    result = items[index];

    if (index > 0) {
        result.previous = items[index - 1].id;
    }

    if (index < items.length - 1) {
        result.next = items[index + 1].id;
    }

    deferred.resolve(result);
    console.log('END getItem RESOLVED');

    return deferred.promise;
}

function saveItem(item) {
    console.log('BEGIN saveItem');

    var deferred = Q.defer(),
        items = JSON.parse(fs.readFileSync(itemsFile, 'utf8')),
        baseFilename = '/images/items/' + item.id,
        filename,
        extension,
        source,
        destination,
        itemIndex,
        existingImages;

    _.forEach(items, function(existingItem, index) {
        if (item.id === existingItem.id) {
            itemIndex = index;
            existingImages = existingItem.images;
            return;
        }
    });

    _.forEach(item.images, function(image, index) {
        if (_.includes(image, '/tmp/')) {
            extension = image.split('.').pop();
            filename = baseFilename + '-' + (index + 1) + '.' + extension;
            source = __dirname + image;
            destination = __dirname + filename;

            moveFile(source, destination, function() {});

            item.images[index] = filename;
        } else {
            _.pull(existingImages, image);
        }
    });

    _.forEach(existingImages, function(existingImage) {
        if (!_.includes(item.images, existingImage)) {
            fs.unlinkSync(__dirname + existingImage);
        }
    });

    if (_.isUndefined(itemIndex)) {
        items.push(item);
    } else {
        items[itemIndex] = item;
    }

    fs.writeFileSync(itemsFile, JSON.stringify(items, null, 4));

    deferred.resolve(item);
    console.log('END saveItem RESOLVED');

    return deferred.promise;
}

function deleteItem(item) {
    console.log('BEGIN deleteItem');

    var deferred = Q.defer(),
        items = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));

    _.forEach(items, function(existingItem, index) {
        if (item.id === existingItem.id) {
            _.forEach(existingItem.images, function(image) {
                fs.unlinkSync(__dirname + image);
            });

            items.splice(index, 1);
            fs.writeFileSync(itemsFile, JSON.stringify(items, null, 4));

            return;
        }
    });

    deferred.resolve();
    console.log('END deleteItem RESOLVED');

    return deferred.promise;
}

function saveImage(file) {
    console.log('BEGIN saveImage');

    var deferred = Q.defer(),
        extension = file.type.replace(/.+\//, ''),
        filename = '/images/tmp/' + new Date().getTime() + '.' + extension,
        source = file.path,
        destination = __dirname + filename;

    moveFile(source, destination, function() {
        deferred.resolve(filename);
        console.log('END saveImage RESOLVED');
    });

    return deferred.promise;
}

function deleteImage(file) {
    var deferred = Q.defer();

    if (_.includes(file, '/tmp/')) {
        console.log('BEGIN deleteImage');

        fs.unlinkSync(__dirname + file);

        console.log('END deleteImage RESOLVED');
    }

    deferred.resolve();

    return deferred.promise;
}

function getArgs(args) {
    if (args && _.isString(args)) {
        return JSON.parse(args);
    }

    return {};
}

function moveFile(source, destination, callback) {
    var inputStream = fs.createReadStream(source),
        outputStream = fs.createWriteStream(destination);

    inputStream.pipe(outputStream);
    inputStream.on('end', function() {
        fs.unlinkSync(source);
        callback();
    });
    inputStream.on('error', function(error) {
        throw new Error(error);
    });
}


module.exports = {

    login: login,
    getItems: getItems,
    getItem: getItem,
    saveItem: saveItem,
    deleteItem: deleteItem,
    saveImage: saveImage,
    deleteImage: deleteImage

};
