export const ROLES_COLLECTION = {
  name: 'roles',
  documents: [
    {
      id: 'admin',
      name: 'Admin',
      description: 'A user with access to all collections',
      createdOn: Date.now()
    },
    {
      id: 'subject',
      name: 'Subject',
      description: 'A user with access to researches',
      createdOn: Date.now()
    }
  ]
};
