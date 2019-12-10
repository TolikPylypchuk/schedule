import { Result } from "./result";

export class UglyResult implements Result {
    message = "Розклад не відповідає вимогам.";
    icon = "fa-frown-o";
    color = "danger";
}
