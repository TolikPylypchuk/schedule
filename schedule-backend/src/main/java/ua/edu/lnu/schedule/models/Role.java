package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

public class Role implements Serializable {
	public enum Name {
		LECTURER,
		EDITOR,
		ADMIN
	}
	
	private Integer id;
	private Name name;
	
	@JsonIgnore
	private Set<User> users;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "name", nullable = false)
	@Enumerated(EnumType.STRING)
	public Name getName() {
		return this.name;
	}
	
	public void setName(Name name) {
		this.name = name;
	}
	
	@ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
	public Set<User> getUsers() {
		return this.users;
	}
	
	public void setUsers(Set<User> users) {
		this.users = users;
	}
}
