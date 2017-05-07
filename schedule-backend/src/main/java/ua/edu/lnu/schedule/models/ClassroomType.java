package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "classroom_types")
public class ClassroomType implements Serializable {
	private Integer id;
	private String type;

	@JsonIgnore
	private Set<Class> classes;

	@JsonIgnore
	private Set<Classroom> classrooms;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "type", nullable = false, unique = true, length = 20)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "classroomType")
	public Set<Class> getClasss() {
		return this.classes;
	}

	public void setClasss(Set<Class> classes) {
		this.classes = classes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "type")
	public Set<Classroom> getClassrooms() {
		return this.classrooms;
	}

	public void setClassrooms(Set<Classroom> classrooms) {
		this.classrooms = classrooms;
	}
}
