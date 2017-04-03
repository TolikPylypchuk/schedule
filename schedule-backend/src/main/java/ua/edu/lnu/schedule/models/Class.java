package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "classes")
public class Class implements Serializable {
	public enum Frequency {
		WEEKLY,
		NUMERATOR,
		DENOMINATOR
	}
	
	private Integer id;
	private int number;
	private DayOfWeek dayOfWeek;
	private Frequency frequency;
	private Set<Group> groups;
	private Subject subject;
	private Set<Classroom> classrooms;
	private Set<Lecturer> lecturers;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "number", nullable = false)
	public int getNumber() {
		return this.number;
	}
	
	public void setNumber(int number) {
		this.number = number;
	}
	
	@Column(name = "day_of_week", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	public DayOfWeek getDayOfWeek() {
		return this.dayOfWeek;
	}
	
	public void setDayOfWeek(DayOfWeek dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	
	@Column(name = "frequency", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	public Frequency getFrequency() {
		return this.frequency;
	}
	
	public void setFrequency(Frequency frequency) {
		this.frequency = frequency;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "class_group")
	public Set<Group> getGroups() {
		return this.groups;
	}
	
	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "subject", nullable = false)
	public Subject getSubject() {
		return this.subject;
	}
	
	public void setSubject(Subject subject) {
		this.subject = subject;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "class_classroom")
	public Set<Classroom> getClassrooms() {
		return this.classrooms;
	}
	
	public void setClassrooms(Set<Classroom> classrooms) {
		this.classrooms = classrooms;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "class_lecturer")
	public Set<Lecturer> getLecturers() {
		return this.lecturers;
	}
	
	public void setLecturers(Set<Lecturer> lecturers) {
		this.lecturers = lecturers;
	}
}
