import {hash} from 'bcrypt';
import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const signUp = functions
  .region(STATIC_CONFIG.cloudRegion)
  .runWith({memory: '2GB'})
  .https
  .onCall(async data => {
    const fs = firestore();
    const {password, id, research} = data;

    if (!password || !id || !research) {
      return {error: 'Nedostaje neki od obaveznih parametara.'};
    }

    const researchDoc = await fs.doc(`researches/${research}`).get();
    const rData = (researchDoc.data() as any);

    if (!researchDoc.exists || !rData.active) {
      return {error: 'Odabrano istraživanje nije pronađeno.'}
    }

    const uId = `${rData.prefix}-${id}`;
    const subjectDoc = await researchDoc.ref.collection('subjects').doc(uId).get();

    if (!subjectDoc.exists || (subjectDoc.data() as any).assigned) {
      return {error: 'Vaš identifikator nije ispravan. Provjerite velika/mala slova te jeste li izabrali pravo istraživanje.'}
    }

    const pw = await hash(password, 10);

    await Promise.all([
      subjectDoc.ref.collection('added').doc('secrets').set({password: pw}),
      subjectDoc.ref.update({assigned: true, assignedOn: Date.now()})
    ]);

    const token = await auth().createCustomToken(uId, {research});

    return {token}
  });
