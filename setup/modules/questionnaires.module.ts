import {CREATED_ON} from './shared/created-on';
import {FORMAT_SEARCH} from './shared/format-search';

export const QUESTIONNAIRES_MODULE = {
  id: 'researches~{docId}~questionnaires',
  name: 'Upitnici',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          title: 'General',
          fields: [
            '/id',
            '/name',
            '/description'
          ]
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
          label: 'Ime'
        },
        {
          key: '/active',
          label: 'Aktivni',
          control: true
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      description: {type: 'string'},
      active: {type: 'boolean'},
      fields: {type: 'array'},
      ...CREATED_ON.property,
    },
    required: [
      'name'
    ]
  },
  definitions: {
    id: {
      label: 'ID',
      hint: 'Automatski kreirano iz imena ako se ostavi praznim',
      disableOn: 'edit',
      formatOnSave: FORMAT_SEARCH('name')
    },
    name: {label: 'Ime'},
    description: {
      label: 'Opis',
      component: {
        type: 'textarea',
        configuration: {
          rows: 5
        }
      }
    },
    fields: {
      component: {
        type: 'fu-fields'
      }
    },
    ...CREATED_ON.definition(),
  }
};
