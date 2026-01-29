package com.ssafy.projectree.global.init;

import com.ssafy.projectree.domain.tech.model.entity.TechVocabulary;
import com.ssafy.projectree.domain.tech.model.repository.TechVocabularyRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
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
			techStackDataLoader.init();
		}
	}

	@Component
	@RequiredArgsConstructor
	public static class TechStackDataLoader {

		private final JdbcTemplate jdbcTemplate; // Repository 대신 JdbcTemplate 주입

		@Transactional
		public void init() throws Exception {
			ClassPathResource resource = new ClassPathResource("data/QueryResults.csv");
			List<TechVocabulary> vocabularies = new ArrayList<>();

			try (BufferedReader br = new BufferedReader(
					new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

				String line;
				boolean isHeader = true;

				while ((line = br.readLine()) != null) {
					if (isHeader) { isHeader = false; continue; }

					String[] columns = line.split(",");
					if (columns.length > 0) {
						String tagName = columns[0].replace("\"", "").trim();
						// 객체 생성만 하고 리스트에 담음
						TechVocabulary vocab = new TechVocabulary();
						vocab.setName(tagName);
						vocabularies.add(vocab);
					}
				}
			}

			if (!vocabularies.isEmpty()) {
				batchInsert(vocabularies); // 별도 메서드로 분리하여 배치 실행
				System.out.println("✅ " + vocabularies.size() + "개의 기술 스택이 성공적으로 로드되었습니다.");
			}
		}

		// JDBC Batch Update 실행
		private void batchInsert(List<TechVocabulary> vocabularies) {
			// 1. SQL에 created_at, updated_at 컬럼을 명시합니다.
			String sql = "INSERT INTO tech_vocabulary (name, created_at, updated_at) VALUES (?, ?, ?)";

			jdbcTemplate.batchUpdate(sql,
					vocabularies,
					1000,
					(PreparedStatement ps, TechVocabulary vocab) -> {
						ps.setString(1, vocab.getName());

						// 2. 현재 시간을 직접 생성해서 넣어줍니다.
						Timestamp now = Timestamp.valueOf(LocalDateTime.now());

						ps.setTimestamp(2, now); // created_at
						ps.setTimestamp(3, now); // updated_at (보통 같이 NOT NULL이므로 함께 설정)
					});
		}
	}
}
