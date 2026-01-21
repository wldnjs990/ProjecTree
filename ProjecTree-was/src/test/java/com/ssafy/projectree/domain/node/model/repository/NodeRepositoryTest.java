package com.ssafy.projectree.domain.node.model.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class NodeRepositoryTest {
	@Autowired
	private NodeRepository nodeRepository;
}