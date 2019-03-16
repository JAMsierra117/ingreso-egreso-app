import { Action } from '@ngrx/store';
import { User } from './user.model';


export const SET_USER = '[Auth] Set User';
export const UNSET_USET = '[Auth] Unset User';


export class SetUserAction implements Action {
    readonly type = SET_USER;

    constructor(public user: User) {

    }
}

export class UnsetUserAction implements Action {
    readonly type = UNSET_USET;
}


export type acciones = SetUserAction | UnsetUserAction;