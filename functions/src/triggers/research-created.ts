import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

/**
 * Updates users custom claims when
 * the users role changes in firestore
 */
export const researchCreated = functions
  .region(STATIC_CONFIG.cloudRegion)
  .firestore
  .document(`${FirestoreCollection.Researches}/{documentId}`)
  .onCreate(async doc => {
    const data = doc.data() as {prefix: string; participants: number};
    const uniqueIds = new Set<string>();

    function randomId() {

      const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const length = 5;

      let retVal = '';

      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }

      return retVal;
    }


    while (uniqueIds.size < data.participants) {
      uniqueIds.add(data.prefix + '-' + randomId());
    }

    await Promise.all(
      [...uniqueIds].map(id =>
        doc.ref.collection('subjects').doc(id).set({assigned: false})
      )
    )
  });

