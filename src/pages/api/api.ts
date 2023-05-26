import { AuthenticationApi } from "./Authentication/api";
import { AbysApi } from "./abys/api";
import { UsersApi } from "./users/api";

export class Api {
    constructor(readonly authentication: AuthenticationApi, readonly abys: AbysApi, readonly users: UsersApi) {}
}