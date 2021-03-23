import {CREATED_ON} from './shared/created-on';

export const QUESTIONNAIRES_MODULE = {
  id: 'researches~{docId}~questionnaires',
  name: 'Upitnici',
  authorization: {
    write: ['admin'],
    read: ['subject']
  },
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'General',
          fields: ['/id', '/name', '/description']
        },
        {
          type: 'empty',
          fields: ['/fields']
        }
      ]
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/id',
          label: 'ID'
        },
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/id',
          label: 'Predaje',
          pipe: ['custom', 'jpSanitize'],
          pipeArguments: {
            0: `(id => '<jms-e-link link=/m/forms/' + id + '/submissions >View</jms-e-link>')`
          }
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      description: {type: 'string'},
      fields: {type: 'array'},
      ...CREATED_ON.property,
    }
  },
  definitions: {
    id: {
      label: 'ID',
      hint: 'Automatski kreirano iz imena ako se ostavi praznim',
      disableOn: 'edit'
    },
    name: {label: 'Ime'},
    description: {label: 'Opis'},
    fields: {
      component: {
        type: 'fu-fields'
      }
    },
    ...CREATED_ON.definition(),
  }
};
