import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { getAuthorityName } from "../../common/models/functions";
import { Authority, Faculty, User, Department } from "../../common/models/models";
import { FacultyService, UserService } from "../../common/services/services";

@Component({
	selector: "schedule-admin-user-modal",
	templateUrl: "./user-modal.component.html"
})
export class UserModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private facultyService: FacultyService;
	// private departmentService: DepartmentService;
	private userService: UserService;

	getAuthorityName = getAuthorityName;

	user: User = {
		username: null,
		firstName: null,
		middleName: null,
		lastName: null,
		position: null,
		password: "pass",
		department: null,
		authorities: []
	};

	authorities: Authority[] = [];
	faculties: Faculty[] = [];

	isEditing = false;
	error = false;
	errorText: string = null;

	constructor(
		activeModal: NgbActiveModal,
		facultyService: FacultyService,
		userService: UserService) {
		this.activeModal = activeModal;
		this.facultyService = facultyService;
		this.userService = userService;
	}

	ngOnInit(): void {
		if (this.isEditing) {
			// this.user.department = this.faculties.find(
			// 	f => f.id === this.user.department.faculty.id);
		}
	}

	isAuthorityChecked(authority: Authority): boolean {
		return !!this.user.authorities.find(a => a.id === authority.id);
	}

	authorityChecked(authority: Authority) {
		if (!!this.user.authorities.find(a => a.id === authority.id)) {
			this.user.authorities = this.user.authorities.filter(
				a => a.id !== authority.id);
		} else {
			this.user.authorities.push(authority);
		}
	}

	change(): void {
		this.error = false;
		this.errorText = null;
	}

	submit(): void {
		if (!this.isUserValid()) {
			this.error = true;
			this.errorText = "Дані неправильно заповнені.";
		}

		const action = this.isEditing
			? this.userService.updateUser(this.user)
			: this.userService.addUser(this.user);

		action.subscribe(
			() => this.activeModal.close(this.user),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти";
		});

		action.connect();
	}

	isUserValid(): boolean {
		return this.user.username && this.user.username.length !== 0 &&
			this.user.authorities.length !== 0 &&
			this.user.firstName && this.user.firstName.length !== 0 &&
			this.user.middleName && this.user.middleName.length !== 0 &&
			this.user.lastName && this.user.lastName.length !== 0 &&
			this.user.position && this.user.position.length !== 0 &&
			this.user.department !== null;
	}
}
