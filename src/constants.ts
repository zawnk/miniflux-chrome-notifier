export interface IEventMessage {
    message: EMessageType
    payload?: any
}

export enum EMessageType {
    GetToken = 'GET_TOKEN',
    SetToken = 'SET_TOKEN',
    GetUrl = 'GET_URL',
    SetUrl = 'SET_URL',
    GetUpdatePeriod = 'GET_UPDATE_PERIOD',
    SetUpdatePeriod = 'SET_UPDATE_PERIOD',
    GetNotificationsEnabled = 'GET_NOTIFICATIONS_ENABLED',
    SetNotificationsEnabled = 'SET_NOTIFICATIONS_ENABLED',
    UpdateUnreadCount = 'UPDATE_UNREAD_COUNT'
}