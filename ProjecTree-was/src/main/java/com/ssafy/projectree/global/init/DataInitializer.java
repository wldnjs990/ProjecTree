package com.ssafy.projectree.global.init;

import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Log4j2
public class DataInitializer {

	private final TechStackDataLoader techStackDataLoader;
	private final TechVocabularyRepository techVocabularyRepository;

	@PostConstruct
	public void init() throws Exception {
		if (techVocabularyRepository.count() > 0) {
			log.info("tech vocab already init");
		} else {
		//	techStackDataLoader.init();
		}

	}

	@Component
	@RequiredArgsConstructor
	public static class TechStackDataLoader {

		private final TechVocabularyRepository techVocabularyRepository;

		@Transactional
		public void init() throws Exception {
			ClassPathResource resource = new ClassPathResource("data/QueryResults.csv");

			List<TechVocabulary> vocabularies = new ArrayList<>();

			try (BufferedReader br = new BufferedReader(
					new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

				String line;
				boolean isHeader = true;

				while ((line = br.readLine()) != null) {
					if (isHeader) {
						isHeader = false;
						continue;
					}

					String[] columns = line.split(",");
					if (columns.length > 0) {
						String tagName = columns[0].replace("\"", "").trim();
						TechVocabulary vocab = new TechVocabulary();
						vocab.setName(tagName);
						vocabularies.add(vocab);
//						if (!techVocabularyRepository.existsByName(tagName)) {
//
//						}
					}
				}
			}

			if (!vocabularies.isEmpty()) {
				techVocabularyRepository.saveAll(vocabularies);
				System.out.println("✅ " + vocabularies.size() + "개의 기술 스택이 성공적으로 로드되었습니다.");
			}
		}
	}
}
