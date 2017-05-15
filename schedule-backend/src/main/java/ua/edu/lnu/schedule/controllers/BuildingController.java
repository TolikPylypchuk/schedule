package ua.edu.lnu.schedule.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Building;
import ua.edu.lnu.schedule.repositories.BuildingRepository;

import java.net.URI;
import java.net.URISyntaxException;

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
	public ResponseEntity<?> post(
		@RequestBody Building building)
		throws URISyntaxException {
		this.buildings.save(building);
		
		return ResponseEntity.created(
			new URI("/buildings/" + building.getId())).build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Building building) {
		if (!this.buildings.exists(id)) {
			ResponseEntity.notFound().build();
		}
		
		building.setId(id);
		this.buildings.save(building);
		
		return ResponseEntity.noContent().build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.buildings.exists(id)) {
			ResponseEntity.notFound().build();
		}
		
		this.buildings.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}
