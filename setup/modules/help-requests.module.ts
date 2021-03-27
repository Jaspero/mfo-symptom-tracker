import {CREATED_ON} from './shared/created-on';

export const HELP_REQUESTS_MODULE = {
  id: 'help-requests',
  name: 'Upiti ispitanika',
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
            '/description'
          ],
        },
      ],
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/type',
          label: 'Tip upita',
          pipe: ['titlecase']
        },
        {
          key: '/research',
          label: 'Istraživanje',
          populate: {
            collection: 'researches'
          }
        },
        {
          key: '/subject',
          label: 'Ispitanik'
        },
        {
          key: '/description',
          // TODO: Add ellipsis
          label: 'Opis'
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      subject: {type: 'string'},
      research: {type: 'string'},
      type: {type: 'string'},
      description: {type: 'string'},
    }
  },
  definitions: {
    subject: {
      label: 'Ispitanik',
      disableOn: 'edit'
    },
    type: {
      label: 'Tip upita',
      disableOn: 'edit'
    },
    description: {
      label: 'Opis',
      disableOn: 'edit',
      component: {
        type: 'textarea',
        configuration: {
          rows: 10
        }
      }
    }
  }
};
