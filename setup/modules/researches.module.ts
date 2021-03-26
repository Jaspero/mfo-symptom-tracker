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
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'Ime'
        },
        {
          key: '/prefix',
          label: 'Prefiks'
        },
        {
          key: '/participants',
          label: 'Broj Ispitanika',
          pipe: ['number']
        },
        {
          key: '/active',
          label: 'Aktivno',
          control: true
        }
      ],
      actions: [
        {
          value: `v => '<jms-e-link link="/m/researches/{{v.id}}/subjects/overview" icon="people">Subjekti</jms-e-link>'`
        },
        {
          value: `v => '<jms-e-link link="/m/researches/{{v.id}}/questionnaires/overview" icon="feed">Upitnici</jms-e-link>'`
        },
        {
          value: `v => '<jms-e-link link="/m/researches/{{v.id}}/announcements/overview" icon="campaign">Objave</jms-e-link>'`
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
      prefix: {type: 'string'},
      terms: {type: 'string'},
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
    description: {
      label: 'Opis',
      component: {
        type: 'textarea'
      }
    },
    terms: {
      label: 'Privola',
      component: {
        type: 'fb-tinymce'
      }
    },
    participants: {label: 'Broj Ispitanika'},
    prefix: {label: 'Prefix'},
    active: {label: 'Aktivno'},
    ...CREATED_ON.definition()
  }
};
