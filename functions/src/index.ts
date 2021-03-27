import {initializeApp, credential} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {getUser} from './callable/get-user';
import {login} from './callable/login';
import {removeUser} from './callable/remove-user';
import {signUp} from './callable/sign-up';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateEmail} from './callable/update-email';
import {updateUser} from './callable/update-user';
import {actionController} from './rest/action-controller';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {documentDeleted} from './triggers/document-deleted';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {researchCreated} from './triggers/research-created';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {userDocumentUpdated} from './triggers/user-document-updated';

initializeApp({
  credential: credential.cert(require('../serviceAccountKey.json')),
  databaseURL: 'https://mfo-symptom-tracker.firebaseio.com'
});

export const cms = {
  // Triggers
  userCreated,
  userDeleted,
  userDocumentUpdated,
  fileCreated,
  fileDeleted,
  documentDeleted,
  triggerPasswordReset,
  researchCreated,

  // Callable
  createUser,
  removeUser,
  updateUser,
  getUser,
  updateEmail,
  login,
  signUp,

  // Rest
  exportData,
  importData,
  actionController
};
