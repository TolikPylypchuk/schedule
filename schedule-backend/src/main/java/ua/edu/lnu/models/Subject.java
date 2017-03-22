package ua.edu.lnu.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject implements Serializable {
	private Integer id;
	private String name;
	private String classroomType;
	private Set<Group> groups;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", length = 100, nullable = false)
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "classroom_type", nullable = false, length = 20)
	public String getClassroomType() {
		return this.classroomType;
	}
	
	public void setClassroomType(String classroomType) {
		this.classroomType = classroomType;
	}
	
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "subjects")
	public Set<Group> getGroups() {
		return this.groups;
	}
	
	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}
}
