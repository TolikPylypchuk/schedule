package ua.edu.lnu.schedule.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "subjects")
public class Subject implements Serializable {
	private Integer id;
	private String name;
	private String classroomType;
	
	@JsonIgnore
	private Set<Plan> plans;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
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
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "subject")
	public Set<Plan> getPlans() {
		return this.plans;
	}
	
	public void setPlans(Set<Plan> plans) {
		this.plans = plans;
	}
}
