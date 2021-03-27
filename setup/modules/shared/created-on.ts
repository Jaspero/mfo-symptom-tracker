export const CREATED_ON = {
  sort: {
    active: 'createdOn',
    direction: 'desc'
  },
  column: (
    sortable = true,
    label = 'GENERAL.DATE',
    format = 'dd/MM/yy HH:mm'
  ) => ({
    key: '/createdOn',
    label,
    pipe: ['date'],
    ...sortable && {sortable: true},
    pipeArguments: {
      0: [format]
    }
  }),
  property: {
    createdOn: {type: 'number'}
  },
  definition: (
    id = 'createdOn',
    label = 'GENERAL.CREATED_ON',
    createInitially = true
  ) => ({
    [id]: {
      label,
      ...createInitially && {
        disableOn: 'edit',
        formatOnLoad: '(value) => value || Date.now()',
      },
      component: {
        type: 'date',
        configuration: {
          includeTime: true,
          labelHours: 'GENERAL.HOURS',
          labelMinutes: 'GENERAL.MINUTES',
          format: 'number'
        }
      }
    },
  })
};
