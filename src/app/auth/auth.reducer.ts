import * as fromAuthAction from './auth.actions';
import { User } from './user.model';


export interface AuthState {    
    user: User;
}

const initState: AuthState = {
    user: null
}
export function authReducer(state = initState, action: fromAuthAction.acciones): AuthState {

    switch(action.type) {
        case fromAuthAction.SET_USER:
            return {
                user: { ... action.user }
            }
            
        case fromAuthAction.UNSET_USET:
            return {
                user: null
            }
        default:
            return state;
    }
}