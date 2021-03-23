import {CREATED_ON} from './shared/created-on';

export const RESEARCHES_MODULE = {
  id: 'researches',
  name: 'Istraživanja',
  authorization: {
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          fields: [
            '/name',
            '/prefix',
            '/description',
            '/participants'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/prefix',
          label: 'Prefix'
        },
        {
          key: '/participants',
          label: 'Participants',
          pipe: ['number']
        },
        {
          key: '/active',
          label: 'Active',
          control: true
        }
      ],
      actions: [
        {
          value: `v => '<jms-e-link link="/m/researches/{{it.id}}/subjects/overview" icon="people">Subjekti</jms-e-link>'`
        },
        {
          value: `v => '<jms-e-link link="/m/forms/{{it.id}}/questionnaires/overview" icon="feed">Upitnici</jms-e-link>'`
        }
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      description: {type: 'string'},
      participants: {type: 'number'},
      active: {type: 'boolean'},
      ...CREATED_ON.property
    },
    required: [
      '/name',
      '/prefix',
      '/participants'
    ]
  },
  definitions: {
    name: {label: 'Ime'},
    description: {label: 'Opis'},
    participants: {label: 'Broj Ispitanika'},
    prefix: {label: 'Prefix'},
    active: {label: 'Aktivno'},
    ...CREATED_ON.definition()
  }
};
