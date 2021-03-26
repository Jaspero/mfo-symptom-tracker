import {CREATED_ON} from './shared/created-on';

export const ANNOUNCEMENTS_MODULE = {
  id: 'researches~{docId}~announcements',
  authorization: {
    write: ['admin']
  },
  layout: {
    editTitleKey: 'title',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          fields: [
            '/title',
            '/content'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/title',
          label: 'Naslov'
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      title: {type: 'string'},
      content: {type: 'string'},
    }
  },
  definitions: {
    title: {label: 'Naslov'},
    content: {
      label: 'Sadržaj',
      component: {
        type: 'fb-tinymce'
      }
    }
  }
};
