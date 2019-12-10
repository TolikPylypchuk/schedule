import { Result } from "./result";

export class BadResult implements Result {
    message = "Розклад порушує деякі вимоги.";
    icon = "fa-meh-o";
    color = "warning";
}
