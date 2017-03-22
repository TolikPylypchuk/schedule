package ua.edu.lnu.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "faculties")
public class Faculty implements Serializable {
	private Integer id;
	private String name;
	private Set<Group> groups;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", unique = true, nullable = false, length = 50)
	public String getName() {
		return this.name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "faculty")
	public Set<Group> getGroups() {
		return this.groups;
	}
	
	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}
	
}
