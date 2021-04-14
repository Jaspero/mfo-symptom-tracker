const admin = require('firebase-admin');
const {writeFileSync} = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(require('../serviceAccountKey.json'))
});

async function exec() {
  const samples = await admin.firestore().collection('researches/a3XqbbU91GMfek7IbJ4X/subjects').get();

  return samples.docs.map(it => it.id).join('\n')
}

exec()
  .then(a => {
    writeFileSync('export.csv', a);
  });
