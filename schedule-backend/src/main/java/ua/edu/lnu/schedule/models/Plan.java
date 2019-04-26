package ua.edu.lnu.schedule.models;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "plans")
public class Plan implements Serializable {
	private Integer id;
	private int numLectures;
	private int numPractice;
	private int numLabs;
	private int course;
	private Semester semester;
	private int year;

	private Subject subject;
	private Department department;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "num_lectures", nullable = false)
	public int getNumLectures() {
		return this.numLectures;
	}

	public void setNumLectures(int numLectures) {
		this.numLectures = numLectures;
	}

	@Column(name = "num_practice", nullable = false)
	public int getNumPractice() {
		return this.numPractice;
	}

	public void setNumPractice(int numPractice) {
		this.numPractice = numPractice;
	}

	@Column(name = "num_labs", nullable = false)
	public int getNumLabs() {
		return this.numLabs;
	}

	public void setNumLabs(int numLabs) {
		this.numLabs = numLabs;
	}

	@Column(name = "course", nullable = false)
	public int getCourse() {
		return this.course;
	}

	public void setCourse(int course) {
		this.year = course;
	}

	@Column(name = "year", nullable = false)
	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	@Column(name = "semester", nullable = false)
	@Enumerated(EnumType.STRING)
	public Semester getSemester() {
		return this.semester;
	}

	public void setSemester(Semester semester) {
		this.semester = semester;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "subject", nullable = false)
	public Subject getSubject() {
		return this.subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "department", nullable = false)
	public Department getDepartment() {
		return this.department;
	}

	public void setGroup(Department department) {
		this.department = department;
	}
}
