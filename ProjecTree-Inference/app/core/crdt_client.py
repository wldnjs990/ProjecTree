"""
CRDT Server HTTP Client

CRDT 서버에 POST 요청을 보내는 간단한 HTTP 클라이언트 모듈.
DeepAgentCallbacks에서 사용됩니다.
"""

import httpx
import logging
from typing import Any, Dict, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class CRDTClient:
    """
    CRDT 서버와 통신하는 HTTP 클라이언트.

    Usage:
        client = CRDTClient()
        await client.send({
            "body": {...}
        })
    """

    def __init__(self, timeout: float = 30.0):
        """
        CRDTClient 초기화.

        Args:
            timeout: HTTP 요청 타임아웃 (초).
        """
        self.server_url = settings.CRDT_SERVER_URL
        self.default_path = settings.CRDT_SERVER_PATH
        self.timeout = timeout

    async def send(
        self, payload: Dict[str, Any], path: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        CRDT 서버에 메시지를 전송합니다.
        매 요청마다 새 클라이언트를 생성하여 event loop 문제 방지.

        Args:
            payload: 전송할 데이터. 'body' 필드에 실제 요청 본문 포함.
            path: (Optional) 기본 경로 대신 사용할 경로.

        Returns:
            서버 응답 (JSON) 또는 None (오류 시).
        """
        try:
            # body 추출 (body 필드가 있으면 사용, 없으면 전체 payload)
            body = payload.get("body", payload)

            target_path = path if path else self.default_path
            url = f"{self.server_url}{target_path}"

            logger.info(f"CRDT 요청 전송: {url}, body: {body}")

            # 매 요청마다 새 클라이언트 생성 (event loop 문제 방지)
            async with httpx.AsyncClient(
                timeout=self.timeout, headers={"Content-Type": "application/json"}
            ) as client:
                response = await client.post(url, json=body)

                response.raise_for_status()

                if response.content:
                    return response.json()
                return {"status": "ok"}

        except httpx.HTTPStatusError as e:
            logger.error(
                f"CRDT 서버 HTTP 오류: {e.response.status_code} - {e.response.text}"
            )
            return None
        except httpx.RequestError as e:
            logger.error(f"CRDT 서버 연결 오류: {e}")
            return None
        except Exception as e:
            logger.error(f"CRDT 클라이언트 예외: {e}")
            return None


def get_crdt_client() -> CRDTClient:
    """
    CRDT 클라이언트 인스턴스를 반환합니다.

    Returns:
        CRDTClient 인스턴스.
    """
    return CRDTClient()
