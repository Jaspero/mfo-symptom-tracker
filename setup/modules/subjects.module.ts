export const SUBJECTS_MODULE = {
  id: 'researches~{docId}~subjects',
  name: 'Subjekti',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    instance: {
      segments: [{
        fields: [
          '/id',
          '/assigned'
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
          key: '/assigned',
          label: 'Dodijeljen',
          pipe: ['custom'],
          pipeArguments: {
            0: `v => v ? 'Da' : 'Ne'`
          }
        },
        {
          key: '/terms',
          label: 'Privola',
          pipe: ['custom'],
          pipeArguments: {
            0: `v => v ? 'Da' : 'Ne'`
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
          label: 'Dodijeljen'
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
          label: 'Dodijeljen',
          filterLabel: 'Dodijeljen'
        }
      }
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      assigned: {type: 'boolean'},
      assignedOn: {type: 'number'},
      termsAccepted: {type: 'boolean'},
      termsAcceptedOn: {type: 'number'}
    }
  },
  definitions: {
    id: {label: 'ID'},
    assigned: {label: 'Dodijeljen'}
  }
};
