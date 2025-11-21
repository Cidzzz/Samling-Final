const VALID_CREDENTIALS = [
    { email: 'admin@admin.com', username: 'admin', password: 'admin', displayName: 'admin' },
    { email: 'mici@admin.com', username: 'mici', password: 'mici', displayName: 'mici fomo' },
    { email: '1@1.com', username: '1', password: '1', displayName: '1' }
];

if (!localStorage.getItem('appUsers')) {
    localStorage.setItem('appUsers', JSON.stringify(VALID_CREDENTIALS));
}