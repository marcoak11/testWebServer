//Socket.IO Server
export interface ServerToClientEvents { //listen
    status: (payload: string) => void; //dal middleware
    notification: (payload: string) => void; //dal middleware
    abort: () => void; //da mobile
}

export type ClientToServerEvents = ServerToClientEvents //emit

export interface InterServerEvents { }

export interface SocketData { }

export type NotifcationType = "info" | "warning" | "error"
export type NotifyActionType = "new" | "withdraw"

export type PLCNotificationType = {
    reason: number,
    type: NotifcationType,
    message: string,
    action: NotifyActionType,
    userConfirmationRequired: boolean,
    uniqueID: string
}

export enum ENotificationReason
{
	ENotificationReason_None,

	ENotificationReason_CheckMachineConsumables, // strType: info, bUserConfirmationRequired = true, strMessage = "", strAction = "new"
	ENotificationReason_CloseDoor, // strType: info, bUserConfirmationRequired = false, strMessage = "", strAction = "new" | "whithdraw"
	ENotificationReason_UVInProgress, // strType: info, bUserConfirmationRequired = false, strMessage = "", strAction = "new" | "whithdraw"
	ENotificationReason_CentrifugeLockSystemError, // strType: warning, bUserConfirmationRequired = false, strMessage = "", strAction = "new" | "whithdraw"
	ENotificationReason_PrimingFinished, // strType: info, bUserConfirmationRequired = true, strMessage = "", strAction = "new"
	ENotificationReason_PrimingInProgress, // strType: info, bUserConfirmationRequired = true, strMessage = "", strAction = "new" | "whithdraw"
	//ENotificationReason_Abort, // strType: error, bUserConfirmationRequired = false, strMessage = codice di errore, strAction = "new" | "whithdraw"
	ENotificationReason_GenericMessage, // strType: info, bUserConfirmationRequired = true, strMessage = messaggio, strAction = "new"

	ENotificationReason_Tot
};
