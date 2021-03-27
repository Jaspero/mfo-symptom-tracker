export const SETTINGS_COLLECTION = {
  name: 'settings',
  documents: [
    {
      id: 'user',
      roles: [
        {
          email: 'marija.heffer@gmail.com',
          role: 'admin'
        }
      ]
    },
    {
      id: 'layout',
      navigation: {
        items: [
          {
            icon: 'dashboard',
            label: 'LAYOUT.DASHBOARD',
            type: 'link',
            value: '/dashboard'
          },
          {
            icon: 'science',
            label: 'Istraživanja',
            type: 'link',
            value: '/m/researches/overview'
          },
          {
            icon: 'help_center',
            label: 'Upiti ispitanika',
            type: 'link',
            value: '/m/help-requests/overview'
          },
          {
            children: [
              {
                icon: 'supervised_user_circle',
                label: 'GENERAL.USERS',
                type: 'link',
                value: '/m/users/overview'
              },
              {
                icon: 'vpn_key',
                label: 'GENERAL.ROLES',
                type: 'link',
                value: '/m/roles/overview'
              }
            ],
            icon: 'account_box',
            label: 'LAYOUT.MANAGEMENT',
            type: 'expandable'
          }
        ]
      }
    }
  ]
};
