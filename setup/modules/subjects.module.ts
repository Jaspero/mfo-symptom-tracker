export const SUBJECTS_MODULE = {
  id: 'researches~{docId}~subjects',
  name: 'Subjekti',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    table: {
      tableColumns: [
        {
          key: '/id',
          label: 'ID'
        },
        {
          key: '/assigned',
          label: 'Assigned'
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
      assigned: {type: 'boolean'}
    }
  },
  definitions: {
    id: {label: 'ID'},
    assigned: {label: 'Dodijeljen'}
  }
};
