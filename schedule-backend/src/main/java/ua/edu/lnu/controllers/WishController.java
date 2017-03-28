package ua.edu.lnu.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.models.Wish;
import ua.edu.lnu.repositories.WishRepository;

@RestController
@RequestMapping("/api/wishes")
public class WishController {
	private WishRepository wishes;
	
	@Autowired
	public void setWishes(WishRepository wishes) {
		this.wishes = wishes;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Wish> getAll() {
		return this.wishes.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Wish getById(@PathVariable("id") int id) {
		return this.wishes.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Wish wish, HttpServletResponse response) {
		this.wishes.save(wish);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Wish group,
		HttpServletResponse response) {
		if (!this.wishes.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		group.setId(id);
		this.wishes.save(group);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.wishes.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.wishes.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}
