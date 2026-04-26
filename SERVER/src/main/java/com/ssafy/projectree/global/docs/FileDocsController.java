package com.ssafy.projectree.global.docs;

import com.ssafy.projectree.domain.file.api.dto.FileUploadDto;
import com.ssafy.projectree.global.api.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "File", description = "파일 업로드 및 조회 관련 API")
@RequestMapping("/files")
public interface FileDocsController {

    @Operation(
            summary = "워크스페이스 파일 업로드",
            description = "특정 워크스페이스에 파일을 업로드합니다. 여러 파일을 동시에 업로드할 수 있습니다. (Content-Type: multipart/form-data)"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "업로드 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FileUploadDto.Response.class),
                            examples = @ExampleObject(
                                    value = """
                                    {
                                        "success": true,
                                        "message": "파일 업로드 성공",
                                        "data": {
                                            "fileUrls": [
                                                "https://s3.amazonaws.com/bucket/file1.jpg",
                                                "https://s3.amazonaws.com/bucket/file2.png"
                                            ]
                                        }
                                    }
                                    """
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping(value = "/workspaces/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    CommonResponse<FileUploadDto.Response> upload(
            @Parameter(name = "files", description = "업로드할 파일 목록")
            @RequestPart(value = "files") List<MultipartFile> multipartFiles,
            @Parameter(description = "워크스페이스 ID", example = "1")
            @PathVariable Long id
    ) throws IOException;

}
