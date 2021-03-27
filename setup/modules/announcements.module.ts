import {CREATED_ON} from './shared/created-on';

export const ANNOUNCEMENTS_MODULE = {
  id: 'researches~{docId}~announcements',
  name: 'Objave',
  authorization: {
    read: ['admin'],
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
        },
        {
          key: '/active',
          label: 'Aktivna',
          control: true
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      title: {type: 'string'},
      content: {type: 'string'},
      active: {type: 'boolean'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    title: {label: 'Naslov'},
    content: {
      label: 'Sadržaj',
      component: {
        type: 'tinymce'
      }
    },
    ...CREATED_ON.definition()
  }
};
