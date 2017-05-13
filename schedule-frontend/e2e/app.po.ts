import { browser, element, by } from "protractor";

export class ScheduleFrontendPage {
	navigateTo() {
		return browser.get("/");
	}

	getParagraphText() {
		return element(by.css("schedule-root h1")).getText();
	}
}
