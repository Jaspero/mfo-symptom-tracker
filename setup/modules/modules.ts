import {ANNOUNCEMENTS_MODULE} from './announcements.module';
import {HELP_REQUESTS_MODULE} from './help-requests.module';
import {QUESTIONNAIRES_MODULE} from './questionnaires.module';
import {RESEARCHES_MODULE} from './researches.module';
import {ROLES_MODULE} from './roles.module';
import {SUBJECTS_MODULE} from './subjects.module';
import {SYMPTOMS_MODULE} from './symptoms.module';
import {USERS_MODULE} from './users.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,

  RESEARCHES_MODULE,
  SUBJECTS_MODULE,
  QUESTIONNAIRES_MODULE,
  ANNOUNCEMENTS_MODULE,
  SYMPTOMS_MODULE,
  HELP_REQUESTS_MODULE
];
