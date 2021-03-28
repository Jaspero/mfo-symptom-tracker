import {compare} from 'bcrypt';
import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const login = functions
  .region(STATIC_CONFIG.cloudRegion)
  .runWith({memory: '2GB'})
  .https
  .onCall(async data => {
    const fs = firestore();
    const {password, id, research} = data;

    if (!password || !id || !research) {
      return {error: 'Nedostaje neki od obveznih parametara.'};
    }

    const researchDoc = await fs.doc(`researches/${research}`).get();
    const rData = (researchDoc.data() as any);


    if (!researchDoc.exists || !rData.active) {
      return {
        error: 'Odabrano istraživanje ne postoji ili nije aktivno.'
      }
    }

    const uId = `${rData.prefix}-${id}`;
    const subjectDoc = await researchDoc.ref.collection('subjects').doc(uId).get();

    if (!subjectDoc.exists) {
      return {
        error: 'Vaš identifikator nije ispravan.'
      }
    }

    if (!(subjectDoc.data() as any).assigned) {
      return {
        error: 'Ovaj identifikator još nije aktiviran. Morate se prvo registrirati.'
      }
    }

    const secrets = await subjectDoc.ref.collection('added').doc('secrets').get();

    if (!secrets.exists) {
      return {
        error: 'Nešto nije uredu s vašim računom. Molim kontaktirajte administratora.'
      }
    }

    const {password: hashedPassword} = secrets.data() as any;

    const result = await compare(password, hashedPassword);

    if (!result) {
      return {
        error: 'Neispravna lozinka. Ukoliko ste zaboravili lozinku molim vas kontaktirajte administratora.'
      }
    }

    const token = await auth().createCustomToken(uId, {research});

    return {token};
  });
