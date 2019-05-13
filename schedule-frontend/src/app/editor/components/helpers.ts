import * as models from "../../common/models/models";

export enum ClassFrequency {
	NONE,
	WEEKLY,
	NUMERATOR,
	DENOMINATOR,
	BIWEEKLY
}

export class ClassCell {
	n: number;
	frequency: ClassFrequency;
	weekly: models.Class;
	numerator: models.Class;
	denominator: models.Class;
}

export function frequencyFromString(frequency: string): ClassFrequency {
	let result = ClassFrequency.NONE;
	switch (frequency) {
		case "Щотижня":
		result = ClassFrequency.WEEKLY;
		break;
		case "По чисельнику":
		result = ClassFrequency.NUMERATOR;
		break;
		case "По знаменнику":
		result = ClassFrequency.DENOMINATOR;
		break;
		case "Через тиждень":
		result = ClassFrequency.BIWEEKLY;
		break;
	}

	return result;
}

export function frequencyToString(frequency: ClassFrequency): string {
	let result = "";
	switch (frequency) {
		case ClassFrequency.WEEKLY:
		result = "Щотижня";
		break;
		case ClassFrequency.NUMERATOR:
		result = "По чисельнику";
		break;
		case ClassFrequency.DENOMINATOR:
		result = "По знаменнику";
        break;
        case ClassFrequency.BIWEEKLY:
        result = "Через тиждень";
        break;
	}

	return result;
}
