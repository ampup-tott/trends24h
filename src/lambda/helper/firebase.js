'use strict';

var admin = require("firebase-admin");

var serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB
});

function setValue(path, obj){
    admin.database().ref(path).set(obj);
}

function setValueFirestore(collection, document, key, obj) {
  admin.firestore().collection(collection).doc(document).set({
    [key]: obj
  })
}

function removePath(path){
  admin.database().ref(path).remove()
}

function updateValue(path, child, obj){
  admin.database().ref(path).child(child).update(obj);
}

function removeObjectKey(path, key) {
  admin.database().ref(path).child(key).remove();
}
function getValue(path, callback){
  return admin
      .database()
      .ref(path).once('value', callback);
}

async function getValueFireStore(collection, document, keys) {
  let result = [];
  await admin.firestore().collection(collection).doc(document).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        for (let i = 0; i < keys.length; i++) {
          result.push({ ...data[keys[i]] });
        }
      }
      else {
        console.log("No such document!");
      }
    })
    .catch(err => {
      console.log(err.message);
    })
    return result;
}

function updateValueFirestore(collection, document, key, obj) {
  admin.firestore().collection(collection).doc(document).update({
    [key]: obj
  })
}

function remove(col, doc) {
  admin.firestore().collection(col).doc(doc).delete()
}

module.exports = {remove, setValue, updateValue, getValue, removePath, removeObjectKey, setValueFirestore, getValueFireStore, updateValueFirestore };