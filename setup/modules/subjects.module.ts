export const SUBJECTS_MODULE = {
  id: 'researches~{docId}~subjects',
  name: 'Ispitanici',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    instance: {
      segments: [{
        fields: [
          '/id',
          '/assigned',
          '/issued'
        ]
      }]
    },
    overview: {
      toolbar: []
    },
    table: {
      hideImport: true,
      tableColumns: [
        {
          key: '/id',
          label: 'ID'
        },
        {
          key: '/issued',
          label: 'Izdan',
          control: true
        },
        {
          key: '/assigned',
          label: 'Registriran',
          pipe: ['custom'],
          pipeArguments: {
            0: `v => v ? 'Da' : 'Ne'`
          }
        },
        {
          key: '/termsAcceptedOn',
          label: 'Privola',
          pipe: ['date'],
          pipeArguments: {
            0: ['dd/MM/yy HH:mm']
          }
        }
      ]
    },
    filterModule: {
      persist: true,
      clearFilters: [],
      value: [
        {
          key: 'assigned',
          operator: '==',
          value: false,
          label: 'Registriran'
        }
      ],
      segments: [{type: 'empty', fields: ['/assigned']}],
      schema: {
        properties: {
          assigned: {type: 'boolean'}
        }
      },
      definitions: {
        assigned: {
          label: 'Registriran',
          filterLabel: 'Registriran'
        }
      }
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      assigned: {type: 'boolean'},
      issued: {type: 'boolean'},
      assignedOn: {type: 'number'},
      termsAccepted: {type: 'boolean'},
      termsAcceptedOn: {type: 'number'}
    }
  },
  definitions: {
    id: {label: 'ID'},
    assigned: {label: 'Registriran'},
    issued: {label: 'Izdan'},
  }
};
