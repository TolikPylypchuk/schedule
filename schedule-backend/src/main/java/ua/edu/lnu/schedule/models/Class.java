package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;

@Entity
@Table(name = "classes")
public class Class implements Serializable {
	public enum Frequency {
		WEEKLY("Щотижня"),
		NUMERATOR("По чисельнику"),
		DENOMINATOR("По знаменнику");
		
		private final String value;
		
		Frequency(String value) {
			this.value = value;
		}
		
		@JsonValue
		public String getValue() {
			return this.value;
		}
		
		@JsonCreator
		public static Frequency fromText(String text) {
			Frequency result = null;
			
			switch (text.toLowerCase()) {
				case "щотижня":
					result = Frequency.WEEKLY;
					break;
				case "по чисельнику":
					result = Frequency.NUMERATOR;
					break;
				case "по знаменнику":
					result = Frequency.DENOMINATOR;
					break;
			}
			
			return result;
		}
	}
	
	public enum Type {
		LECTURE("Лекція"),
		PRACTICE("Практична"),
		LAB("Лабораторна");
		
		private final String value;
		
		Type(String value) {
			this.value = value;
		}
		
		@JsonValue
		public String getValue() {
			return this.value;
		}
		
		@JsonCreator
		public static Type fromText(String text) {
			Type result = null;
			
			switch (text.toLowerCase()) {
				case "лекція":
					result = Type.LECTURE;
					break;
				case "практична":
					result = Type.LECTURE;
					break;
				case "лабораторна":
					result = Type.LECTURE;
					break;
			}
			
			return result;
		}
	}
	
	private Integer id;
	private DayOfWeek dayOfWeek;
	private int number;
	private Frequency frequency;
	private Type type;
	private int year;
	private Semester semester;

	@JsonIgnore
	private ClassroomType classroom_type;
	
	@JsonIgnore
	private Subject subject;
	
	@JsonIgnore
	private Set<Classroom> classrooms;

	@JsonIgnore
	private Set<Group> groups;

	@JsonIgnore
	private Set<Lecturer> lecturers;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	@Column(name = "day_of_week", nullable = false)
	@Enumerated(EnumType.STRING)
	public DayOfWeek getDayOfWeek() {
		return this.dayOfWeek;
	}
	
	public void setDayOfWeek(DayOfWeek dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}

	@Column(name = "number", nullable = false)
	public int getNumber() {
		return this.number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	@Column(name = "frequency", nullable = false)
	@Enumerated(EnumType.STRING)
	public Frequency getFrequency() {
		return this.frequency;
	}
	
	public void setFrequency(Frequency frequency) {
		this.frequency = frequency;
	}

	@Column(name = "type", nullable = false)
	@Enumerated(EnumType.STRING)
	public Type getType() {
		return this.type;
	}

	public void setType(Type type) {
		this.type = type;
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
	@JoinColumn(name = "classroom_type", nullable = false)
	public ClassroomType getClassroom_type() {
		return this.classroom_type;
	}

	public void setClassroom_type(ClassroomType classroom_type) {
		this.classroom_type = classroom_type;
	}

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "class_group",
		joinColumns = { @JoinColumn(name = "class") },
		inverseJoinColumns = { @JoinColumn(name = "group") })
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
	@JoinTable(
		name = "class_classroom",
		joinColumns = { @JoinColumn(name = "class") },
		inverseJoinColumns = { @JoinColumn(name = "classroom") })
	public Set<Classroom> getClassrooms() {
		return this.classrooms;
	}
	
	public void setClassrooms(Set<Classroom> classrooms) {
		this.classrooms = classrooms;
	}
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
		name = "class_lecturer",
		joinColumns = { @JoinColumn(name = "class") },
		inverseJoinColumns = { @JoinColumn(name = "lecturer") })
	public Set<Lecturer> getLecturers() {
		return this.lecturers;
	}
	
	public void setLecturers(Set<Lecturer> lecturers) {
		this.lecturers = lecturers;
	}
}
