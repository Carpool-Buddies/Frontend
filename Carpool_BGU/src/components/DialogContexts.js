export const contextTypes = {
    publishRide: 'publish-ride',
    publishRideSearch: 'publish-ride-search',
    findRide: 'find-ride',
    findRiders: 'find-riders'
}

export const publishRideContext = {
    contextId: contextTypes.publishRide,
    dialogTitle: 'פרסם נסיעה חדשה',
    seats: 'מקומות פנויים',
    dateTime: 'תאריך ושעת יציאה משוערת',
    successDescription: 'תוכל לראות את הנסיעה שלך ברשימת הנסיעות בעמוד הפרופיל שלך',
    submitButtonText: 'שלח',
    dialogLink: contextTypes.publishRide
}

export const publishRideSearchContext = {
    contextId: contextTypes.publishRideSearch,
    dialogTitle: 'פרסם חיפוש טרמפ חדש',
    seats: 'כמות מקומות נדרשת',
    dateTime: 'תאריך ושעת יציאה רצויה',
    successDescription: 'תוכל לראות את הבקשה שלך ברשימת הבקשות בעמוד הפרופיל שלך',
    submitButtonText: 'שלח',
    dialogLink: contextTypes.publishRideSearch
}

export const findRideContext = {
    contextId: contextTypes.findRide,
    dialogTitle: 'חפש טרמפ קיים',
    seats: 'כמות מקומות נדרשת',
    dateTime: 'תאריך ושעת יציאה רצויה',
    successDescription: 'הבקשה שלך נשלחה לאישור הנהג',
    submitButtonText: 'מצא טרמפ',
    dialogLink: contextTypes.findRide
}