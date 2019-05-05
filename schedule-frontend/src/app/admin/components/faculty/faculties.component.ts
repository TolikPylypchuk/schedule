import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Faculty } from "../../../common/models/models";

import { FacultyService } from "../../../common/services/services";
import { FacultyModalComponent } from "./faculty-modal.component";

@Component({
	selector: "schedule-admin-faculties",
	templateUrl: "./faculties.component.html"
})
export class FacultiesComponent implements OnInit {
    private modalService: NgbModal;

	private facultyService: FacultyService;

	faculties: Faculty[] = [];

	constructor(
		modalService: NgbModal,
		facultyService: FacultyService) {
		this.modalService = modalService;

		this.facultyService = facultyService;
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) =>
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name)));
	}

	addFacultyClicked(): void {
		const modalRef = this.modalService.open(FacultyModalComponent);

		modalRef.result.then(
			(faculty: Faculty) => {
				this.faculties.push(faculty);
				this.faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));
			},
			() => { });
	}

	editFacultyClicked(faculty: Faculty): void {
		const modalRef = this.modalService.open(FacultyModalComponent);
		const modal = modalRef.componentInstance as FacultyModalComponent;

		modal.isEditing = true;
		modal.faculty = {
			id: faculty.id,
			name: faculty.name
		};

		modalRef.result.then(
			(updatedFaculty: Faculty) => faculty.name = updatedFaculty.name,
			() => { });
	}

	deleteFacultyClicked(id: number): void {
		const action = this.facultyService.deleteFaculty(id);
		action.subscribe(
			() => this.faculties = this.faculties.filter(f => f.id !== id),
			() => { });

		action.connect();
	}
}
