import { Injectable } from "@angular/core";
import { Class } from "../../common/models/models";
import { ClassFrequency, frequencyFromString, frequencyToString, getDay, getNumber } from "../components/helpers";
import { getDayOfWeekName } from "../../common/models/functions";

@Injectable()
export class DragAndDropService {
	dragPosition: number;
	dragFrequency: number;
	dragClass: Class;
	dragViewObjectId: number;

	dropPosition: number;
	dropFrequency: number;
    dropViewObjectId: number;

	startDrag(c: Class, viewObjectId: number, position: number): void {
		this.dragPosition = position;
		this.dragFrequency = c.frequency === "Щотижня"
			? ClassFrequency.WEEKLY
			: c.frequency === "По чисельнику"
				? ClassFrequency.NUMERATOR
				: ClassFrequency.DENOMINATOR;
		this.dragClass = c;
		this.dragViewObjectId = viewObjectId;
	}

	addDropItem(c: Class, viewObjectId: number, position: number, frequency: number): void {
		this.dropPosition = position;
		this.dropFrequency = position !== -1
			? frequency
			: frequencyFromString(c.frequency);
		this.dropViewObjectId = viewObjectId;
	}

	releaseDrop(): void {
		this.dragClass = null;
        this.dragViewObjectId = null;
        this.dragPosition = null;
        this.dragFrequency = null;

        this.dropViewObjectId = null;
        this.dropPosition = null;
        this.dropFrequency = null;
    }

	updateDroppedClass(c: Class): Class {
		if (this.dropPosition !== -1) {
			c.dayOfWeek = getDayOfWeekName(getDay(this.dropPosition));
			c.number = getNumber(this.dropPosition);
			c.frequency = frequencyToString(this.dropFrequency);
		}

		return c;
    }

    addToView(): boolean {
        return this.dragPosition === -1;
    }

    removeFromView(): boolean {
        return this.dropPosition === -1;
    }

    changeViewObject(): boolean {
        return !this.addToView && !this.removeFromView && this.dragViewObjectId !== this.dropViewObjectId;
    }
}
