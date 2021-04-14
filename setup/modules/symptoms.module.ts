import {CREATED_ON} from './shared/created-on';

export const SYMPTOMS_MODULE = {
  id: 'researches~{docId}~symptoms',
  name: 'Simptomi',
  authorization: {
    write: ['admin'],
    read: ['admin']
  },
  layout: {
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          fields: [
            '/subject',
            '/type',
            '/createdOn',
            '/endedOn',
            '/intensity',
            '/description'
          ]
        }
      ]
    },
    overview: {
      toolbar: []
    },
    table: {
      hideImport: true,
      tableColumns: [
        {
          key: '/subject',
          label: 'Ispitanik'
        },
        CREATED_ON.column(true, 'Početak'),
        {
          key: '/endedOn',
          label: 'Kraj',
          pipe: ['date'],
          pipeArguments: {
            0: ['dd/MM/yy HH:mm']
          }
        },
        {
          key: '/type',
          label: 'Tip'
        },
        {
          key: '/intensity',
          label: 'Intenzitet'
        },
        {
          key: '/description',
          label: 'Description',
          pipe: ['ellipsis'],
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      subject: {type: 'string'},
      type: {type: 'string'},
      endedOn: {type: 'string'},
      intensity: {type: 'number'},
      description: {type: 'string'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    subject: {
      label: 'Subjekt',
      disableOn: 'edit'
    },
    type: {
      label: 'Tip',
      disableOn: 'edit'
    },
    ...CREATED_ON.definition('createdOn', 'Početak'),
    ...CREATED_ON.definition('endedOn', 'Kraj'),
    intensity: {
      label: 'Intenzitet',
      disableOn: 'edit'
    },
    description: {
      label: 'Dodatni opis',
      disableOn: 'edit',
      component: {
        type: 'textarea',
        configuration: {
          rows: 20
        }
      }
    }
  }
};
