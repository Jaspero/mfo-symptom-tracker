import {initializeApp} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {getUser} from './callable/get-user';
import {removeUser} from './callable/remove-user';
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

initializeApp();

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

  // Rest
  exportData,
  importData,
  actionController
};
