package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Building;
import ua.edu.lnu.schedule.repositories.BuildingRepository;

@RestController
@RequestMapping("/buildings")
public class BuildingController {
	private BuildingRepository buildings;
	
	@Autowired
	public void setBuildings(BuildingRepository buildings) {
		this.buildings = buildings;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Building> getAll() {
		return this.buildings.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Building getById(@PathVariable("id") int id) {
		return this.buildings.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(
		@RequestBody Building building,
		HttpServletResponse response) {
		this.buildings.save(building);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Building building,
		HttpServletResponse response) {
		if (!this.buildings.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		building.setId(id);
		this.buildings.save(building);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.buildings.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		this.buildings.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}
